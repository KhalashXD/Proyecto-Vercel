def Telegram(text):
    import asyncio
    from telegram import Bot

    TOKEN = '6570147767:AAGZuoJ7UpWfD04bc5kqKPjbAAUXLlxfUCE'
    CHANNEL_ID = '-1002386750546'

    async def send_message(text, id):
        bot = Bot(token=TOKEN)
        await bot.send_message(chat_id=id, text=text)

    despacho = text
    asyncio.run(send_message(despacho, CHANNEL_ID))