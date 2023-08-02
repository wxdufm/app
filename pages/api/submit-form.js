import * as dotenv from "dotenv";
dotenv.config();

const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res
        .status(405)
        .json({ message: `${req.method} requests are not allowed` });
    }
    try {
      const { name, organization, message } = req.body;
      await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_ID,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: name,
                },
              },
            ],
          },
          Organization: {
            rich_text: [
              {
                text: {
                  content: organization,
                },
              },
            ],
          },
          Message: {
            rich_text: [
              {
                text: {
                  content: message,
                },
              },
            ],
          },
        },
      });
      res.status(201).json({ msg: 'Success' });
    } catch (error) {
      console.error(error)  
      res.status(500).json({msg: 'There was an error'});
    }
  }