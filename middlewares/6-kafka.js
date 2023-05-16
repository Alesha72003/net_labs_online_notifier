const { Kafka } = require('kafkajs')
const { sessions } = require("./5-ws.js")

const kafka = new Kafka({
  clientId: 'online-notification',
  brokers: ['127.0.0.1:9092'],
})

const consumer = kafka.consumer({ groupId: 'test-group' })
const producer = kafka.producer()

async function run() {

  await consumer.connect()
  await consumer.subscribe({ topic: 'OnlineSend', fromBeginning: true })

  await producer.connect()

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value);
      let ok = false;
      if (sessions[value.to]) {
        for (const el of sessions[value.to]) {
          await new Promise((resolve, reject) => {
            el.req.session.reload((e) => {
              if (e) {
                el.close()
                sessions[value.to].delete(el)
              }
              resolve()
            })
          })
          for (const el of sessions[value.to]) {
            if (el.readyState == 1) {
              el.send(JSON.stringify({
                type: "notification/notify",
                payload: value 
              }))
              ok = true;
            }
          }
        }
      }
      if (!ok) {
        await producer.send({
          topic: "VKSend",
          messages: [
            { value: message.value }
          ]
        })
      }
    }
  })
}

module.exports = function (app) {
  run()
}