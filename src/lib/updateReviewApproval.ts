import fs from 'fs/promises';
import path from 'path';

export async function updateReviewApproval(id: number, approved: boolean) {
  const filePath = path.join(process.cwd(), 'public', 'mock-reviews.json');

  // Read the current data
  const data = await fs.readFile(filePath, 'utf-8');
  const json = JSON.parse(data);

  if (!Array.isArray(json.result)) {
    throw new Error('Invalid JSON structure: expected "result" array');
  }

  const review = json.result.find((r: any) => r.id === id);
  if (!review) {
    throw new Error(`Review with id ${id} not found`);
  }

  review.approved = approved;

  // Write updated data back to file
  await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');
}
