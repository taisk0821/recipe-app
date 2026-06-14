import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id         SERIAL PRIMARY KEY,
      message    TEXT        NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const { message } = req.body ?? {};
  if (!message?.trim()) {
    return res.status(400).json({ error: "メッセージが空です" });
  }
  const [row] = await sql`
    INSERT INTO feedbacks (message)
    VALUES (${message.trim()})
    RETURNING id, message, created_at
  `;
  return res.status(201).json({ feedback: row });
}
