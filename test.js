const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'test',
  brokers: ['127.0.0.1:9092'],
})

const producer = kafka.producer()

async function run() {
  await producer.connect()
  await producer.send({
    topic: "OnlineSend",
    messages: [
      {
        value: JSON.stringify({
          from: 0,
          to: 1,
          text: "УРАА"
        })
      }
    ]
  })
  // await producer.disconnect()
}

producer.connect().then(() => {
  setInterval(() => {
    producer.send({
      topic: "OnlineSend",
      messages: [
        {
          value: JSON.stringify({
            from: 0,
            to: 1,
            text: `Тест`
          })
        }
      ]
    })
  },15000);
})
