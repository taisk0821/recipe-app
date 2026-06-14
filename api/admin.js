import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, password, id } = req.body ?? {};

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "認証に失敗しました" });
  }

  const sql = neon(process.env.DATABASE_URL);

  if (action === "list") {
    const rows = await sql`
      SELECT id, message, created_at FROM feedbacks ORDER BY created_at DESC
    `;
    return res.status(200).json({ feedbacks: rows });
  }

  if (action === "delete") {
    if (!id) return res.status(400).json({ error: "IDが必要です" });
    await sql`DELETE FROM feedbacks WHERE id = ${Number(id)}`;
    return res.status(200).json({ ok: true });
  }

  res.status(400).json({ error: "不明なアクション" });
}
