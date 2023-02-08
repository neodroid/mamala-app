/* eslint no-use-before-define: 0 */
import type { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "lib/firebase-admin";

const lobbyRef = firestore.collection("party");

async function searchParty(code: string) {
  const query = await lobbyRef.where("code", "==", code).get();
  if (query.empty) {
    // console.error("No matching lobby found");
    return null;
  }
  return query.docs[0].id;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.body;
  const partyId = await searchParty(code);
  res.json({
    result: partyId,
  });
};
