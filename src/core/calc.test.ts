import calc from './calc';
import { ScalarValue } from '../expression/expression';
import { INT32_MAX_VALUE } from './const';
import { asBoundedNumber } from './types';

describe('calc.flipBit', () => {
    it('calculates flipped bit 32-bit number', () => {
        expect(calc.flipBit(0, 31).value).toBe(1);
        expect(calc.flipBit(1, 31).value).toBe(0);
        expect(calc.flipBit(-1, 31).value).toBe(-2);
        expect(calc.flipBit(2147483647, 0).value).toBe(-1);
        expect(calc.flipBit(-1, 0).value).toBe(2147483647);
        expect(calc.flipBit(2147483647, 30).value).toBe(2147483645);
    });

    it('caulate flipped bit 64-bit nubmer', () => {
        const int64max = BigInt("9223372036854775807");
        expect(calc.flipBit(BigInt(int64max), 0).value.toString()).toBe("-1");
    });

    it('calculates flipped bit', () => {
        expect(calc.flipBit(0, 31).value).toBe(1);
        expect(calc.flipBit(1, 31).value).toBe(0);
        expect(calc.flipBit(-1, 31).value).toBe(-2);
        expect(calc.flipBit(2147483647, 0).value).toBe(-1);
        expect(calc.flipBit(-1, 0).value).toBe(2147483647);
        expect(calc.flipBit(2147483647, 30).value).toBe(2147483645);
    });

    
    it('calcualte 31th bit in 64-bit int', () => {
        expect(calc.flipBit(calc.promoteTo64Bit(-1), 31).value.toString()).toBe("8589934591");
    });

});

describe('calc.numberOfBitsDisplayed', () => {
    it('calculates number of bits', () => {
        expect(calc.numberOfBitsDisplayed(1)).toBe(1);
        expect(calc.numberOfBitsDisplayed(BigInt(-1))).toBe(64);
        expect(calc.numberOfBitsDisplayed(2)).toBe(2);
        expect(calc.numberOfBitsDisplayed(3)).toBe(2);
        expect(calc.numberOfBitsDisplayed(68719476735)).toBe(36);
        expect(calc.numberOfBitsDisplayed(-INT32_MAX_VALUE)).toBe(32);
        expect(calc.numberOfBitsDisplayed(-(BigInt(INT32_MAX_VALUE+1)))).toBe(64);
    });
});

describe('calc.applyTwosComplement', () => {
    it('applies twos complement', () => {
        expect(calc.applyTwosComplement("010")).toBe("110");
        expect(calc.applyTwosComplement("110")).toBe("010"); // reverse
        expect(calc.applyTwosComplement("110")).toBe("010");
        expect(calc.applyTwosComplement("0")).toBe("10");
        expect(calc.applyTwosComplement("10101100")).toBe("01010100");
        expect(calc.applyTwosComplement("01010100")).toBe("10101100"); // reverse
    });
});

describe('calc.rshift', () => {

    it('produces number when given number and vice vers', () => {
        const number = calc.rshift({value:1, maxBitSize:32}, 1).value;
        const bigInt = calc.rshift({value:BigInt(1), maxBitSize:32}, 1).value;

        expect(typeof number).toBe('number');
        expect(number).toBe(2);

        expect(typeof bigInt).toBe('bigint');
        expect(bigInt.toString()).toBe('2');
    });

    it('supports scalar values', () => {
        const operand = new ScalarValue(1);
        expect(calc.rshift(operand, 1).value).toBe(2);
    });

    it("respects bit size", () => {
        expect(calc.rshift({value: BigInt("0b0100"), maxBitSize: 4}, 2).value.toString()).toBe("0");
    });

    it('transitions number to negative', ()=> {
        // 4-bit space
        expect(calc.rshift({value: BigInt("0b0100"), maxBitSize: 4}, 1).value.toString()).toBe("-8");
        
        // 5-bit space
        expect(calc.rshift({value: BigInt("0b00100"), maxBitSize: 5}, 1).value.toString()).toBe("8");
        expect(calc.rshift({value: BigInt("0b01000"), maxBitSize: 5}, 1).value.toString()).toBe("-16");

        // 32-bit
        expect(calc.rshift({value: BigInt("2147483647"), maxBitSize: 32}, 1).value.toString()).toBe("-2");
        expect(calc.rshift({value: BigInt("2147483647"), maxBitSize: 32}, 2).value.toString()).toBe("-4");

        // 64-bit
        expect(calc.rshift({value: BigInt("9223372036854775807"), maxBitSize: 64}, 1).value.toString()).toBe("-2");
        expect(calc.rshift({value: BigInt("9223372036854775807"), maxBitSize: 64}, 2).value.toString()).toBe("-4");
        expect(calc.rshift({value: BigInt("2147483647"), maxBitSize: 64}, 1).value.toString()).toBe("4294967294");
        expect(calc.rshift({value: BigInt("2147483647"), maxBitSize: 64}, 2).value.toString()).toBe("8589934588");

    });
});

describe("calc misc", () => {


    it('promoteTo64Bit', () => {
        expect(calc.promoteTo64Bit(-1).value.toString(2)).toBe("11111111111111111111111111111111");
    });

    it('binaryRepresentation', () => {
        expect(calc.toBinaryString(asBoundedNumber(2147483647))).toBe("1111111111111111111111111111111");
        expect(calc.toBinaryString(new ScalarValue(2147483647))).toBe("1111111111111111111111111111111");
    })

    
});

describe("bitwise ", () => {
    it("NOT same as in node", () => {
        
        for(var i = -100; i<100;i++) {
            const expected = bin(~i);
            const actual = calc.bitwise.not(bin(i));
            expect(`${i} is ${actual}`).toBe(`${i} is ${(expected)}`);
        } 
    });

    it("OR same as in node", () => {
        for(var x = -100; x<100;x++) {
            const y = 5+3%x+x%6*(-x); 
            const expected = bin(x | y);
            const actual = calc.bitwise.or(bin(x), bin(y));

            expect(`${x} is ${actual}`).toBe(`${x} is ${(expected)}`);
        } 
    });

    it("AND same as in node", () => {
        for(var x = -100; x<100;x++) {
            const y = 5+3%x+x%6*(-x); 
            const expected = bin(x & y);
            const actual = calc.bitwise.and(bin(x), bin(y));

            expect(`${x} is ${actual}`).toBe(`${x} is ${(expected)}`);
        } 
    });

    function bin(i: number) {
        return (i >= 0 ? i : i >>> 0).toString(2).padStart(32, i<0 ? '1' : '0');
    }

});