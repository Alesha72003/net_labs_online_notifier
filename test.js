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
          from: 1,
          to: 2,
          text: "УРАА"
        })
      }
    ]
  })
  await producer.disconnect()
}

run()
