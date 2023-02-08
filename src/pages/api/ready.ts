/* eslint no-use-before-define: 0 */
import type { NextApiRequest, NextApiResponse } from "next";

import { firestore } from "lib/firebase-admin";

const lobbyRef = firestore.collection("party");

async function readyParty(partyId: string, uid: string, ready: boolean) {
  return lobbyRef
    .doc(partyId)
    .collection("players")
    .doc(uid)
    .set({ ready }, { merge: true });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { partyId, uid, ready } = req.body;
  const joinId = await readyParty(partyId, uid, ready);
  res.json({
    result: joinId,
  });
};
