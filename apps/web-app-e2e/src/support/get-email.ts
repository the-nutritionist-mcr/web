import { connect } from "imap-simple"

export const getEmail = async (username: string, password: string, server: string, port: number, subject: string) => {

  const config = {
      imap: {
          user: username,
          password,
          host: server,
          port,
          tls: true,
          authTimeout: 3000
      }
  };

  const connection = await connect(config)

  await connection.openBox('INBOX')

  const searchCriteria = [
      'UNSEEN'
  ];

  const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false
  };


  const results = await connection.search(searchCriteria, fetchOptions)

  console.log(results)
}

getEmail(
  "ben@thenutritionistmcr.com",
  "LQkx8FVf",
  "imap.gmail.com",
  993,
  "TNM Invite"
)
