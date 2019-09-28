import * as functions from 'firebase-functions';
import { database } from 'firebase-admin';

/**
 * Function para indexar a quantidade de pagamentos
 */
export const ON_CREATE_PAYMENTS_INDEXERS: functions.CloudFunction<functions.database.DataSnapshot> = functions.database
  .ref('payments/paymentsList/{paymentId}')
  .onCreate(async (snapshot: functions.database.DataSnapshot) => {
    const totalPayments: database.Reference = await snapshot.ref.root.child('payments/paymentsIndexers/totalPayments');

    totalPayments.transaction(payments => {
      return payments + 1;
    });
  });
