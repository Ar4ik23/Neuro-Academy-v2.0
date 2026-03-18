import { NextResponse } from 'next/server';
import { beginCell, Address, toNano } from '@ton/core';

const USDT_DECIMALS = 6;
const PRICE_USDT = 49;

export async function POST(req: Request) {
  const { merchantAddress, senderAddress } = await req.json();
  const body = beginCell()
    .storeUint(0x0f8a7ea5, 32)
    .storeUint(0, 64)
    .storeCoins(BigInt(PRICE_USDT * 10 ** USDT_DECIMALS))
    .storeAddress(Address.parse(merchantAddress))
    .storeAddress(Address.parse(senderAddress))
    .storeBit(0)
    .storeCoins(toNano('0.000000001'))
    .storeBit(0)
    .endCell();

  return NextResponse.json({ payload: body.toBoc().toString('base64') });
}
