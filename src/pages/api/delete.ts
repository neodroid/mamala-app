/* eslint no-use-before-define: 0 */
import type { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "lib/firebase-admin";

const lobbyRef = firestore.collection("party");

async function readyParty(partyId: string, uid: string) {
  return lobbyRef.doc(partyId).collection("players").doc(uid).delete();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { partyId, uid } = req.body;
  const joinId = await readyParty(partyId, uid);
  res.json({
    result: joinId,
  });
};
