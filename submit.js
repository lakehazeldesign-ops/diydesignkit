export default async function handler(req, res) {
  // Allow requests from any origin (your Squarespace/Vercel site)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description, priority } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Task name is required' });
  }

  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/901420998032/task`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'pk_216140620_ETLPSXLMQFTHDKSTT05KEY9FPK2B98J2',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, priority: priority || 2 }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.err || 'ClickUp error' });
    }

    return res.status(200).json({ success: true, taskId: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
