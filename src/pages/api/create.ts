/* eslint no-use-before-define: 0 */
import type { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "lib/firebase-admin";

const codesRef = firestore.collection("codes");
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRandomCode(): string {
  let code = "";
  for (let i = 0; i < 4; i += 1) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

async function generateAndSaveUniqueCode(): Promise<string> {
  const code = generateRandomCode();
  const codeExists = await codesRef.doc(code).get();
  if (!codeExists.exists) {
    await codesRef.doc(code).set({ used: true });
    return code;
  }
  return generateAndSaveUniqueCode();
}

async function createParty(hostUID: string, code: string) {
  const partyRef = await firestore.collection("party").add({
    hostUID,
    code,
    createdAt: new Date(),
  });
  await firestore
    .collection("party")
    .doc(partyRef.id)
    .collection("players")
    .doc(hostUID)
    .set({ joined: true, ready: false }, { merge: true });
  return partyRef.id;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { hostUID } = req.body;
  const code = await generateAndSaveUniqueCode();
  const partyId = await createParty(hostUID, code);
  res.json({
    result: partyId,
  });
};
