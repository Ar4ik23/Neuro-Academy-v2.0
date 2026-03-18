// Клиентский сервис — без @ton/core (только browser-совместимые операции)

export const USDT_MASTER = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs';
export const MERCHANT_ADDRESS = 'UQAekh6j5qq0DYjpWrUVgxxJLVMrkdGoVVTCHARRmuGOp0cD';
export const PRICE_USDT = 49;

// Получить адрес USDT Jetton-кошелька пользователя через TON API
export async function getUserUsdtWallet(userAddress: string): Promise<string> {
  const res = await fetch(
    `https://tonapi.io/v2/accounts/${userAddress}/jettons/${USDT_MASTER}`
  );
  if (!res.ok) throw new Error('Не удалось получить USDT кошелёк');
  const data = await res.json();
  return data.wallet_address.address;
}

// Получить payload для Jetton transfer через наш API route (сервер строит ячейку)
export async function getJettonPayload(senderAddress: string): Promise<string> {
  const res = await fetch('/api/ton-payload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchantAddress: MERCHANT_ADDRESS, senderAddress }),
  });
  if (!res.ok) throw new Error('Не удалось построить payload');
  const { payload } = await res.json();
  return payload;
}

// Проверить входящую USDT транзакцию на кошелёк мерчанта
export async function verifyUsdtPayment(
  senderAddress: string,
  afterTs: number
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://tonapi.io/v2/accounts/${MERCHANT_ADDRESS}/jettons/${USDT_MASTER}/history?limit=20`
    );
    if (!res.ok) return false;
    const data = await res.json();
    const events = data.events ?? [];
    return events.some((e: any) => {
      const ts = e.timestamp * 1000;
      const amount = Number(e.actions?.[0]?.JettonTransfer?.amount ?? 0);
      const sender = e.actions?.[0]?.JettonTransfer?.sender?.address ?? '';
      return (
        ts > afterTs &&
        amount >= PRICE_USDT * 10 ** 6 &&
        sender.toLowerCase().includes(senderAddress.slice(-8).toLowerCase())
      );
    });
  } catch {
    return false;
  }
}
