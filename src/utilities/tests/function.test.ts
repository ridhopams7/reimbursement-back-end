import { getContentType, getExtention, isDateValid } from "..";
import { sha256, uid } from "../HashEncrypt";
import { ucFirst } from "../String";
// import { sha256 } from "../HashEncrypt";

test('sha256', () => {
    expect(sha256('test')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
})

test('isDateValid', () => {
    expect(isDateValid('2011-01-01')).toBe(true)
})

test('getExtention', () => {
    expect(getExtention('image/jpeg')).toBe('.jpeg')
})

test('getContentType', () => {
    expect(getContentType('.jpeg')).toBe('image/jpeg')
})

test('ucFirst', () => {
    expect(ucFirst('test')).toBe('Test')
})

test('uid', () => {
    expect(uid()).toBeTruthy()
})