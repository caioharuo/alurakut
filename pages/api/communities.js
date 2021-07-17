import { SiteClient } from 'datocms-client';

export default async function requestsReceiver(req, res) {
  if (req.method === 'POST') {
    const TOKEN = process.env.REACT_APP_DATO_TOKEN;
    const client = new SiteClient(TOKEN);

    const record = await client.items.create({
      itemType: '968744',
      ...req.body,
    });

    res.json({
      record: record,
    });
    return;
  }
  res.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem.',
  });
}
