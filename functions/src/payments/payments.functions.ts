import * as functions from 'firebase-functions';
import { database } from 'firebase-admin';

/**
 * Function para indexar a quantidade de pagamentos
 */
export const ON_CREATE_PAYMENTS_INDEXERS: functions.CloudFunction<functions.database.DataSnapshot> = functions.database
  .ref('payments/paymentsList/{paymentId}')
  .onCreate(async (snapshot: functions.database.DataSnapshot) => {
    const totalPayments: database.Reference = await snapshot.ref.root.child('payments/paymentsIndexers/totalPayments');

    await totalPayments.transaction(payments => {
      return payments + 1;
    });
  });

/**
 * Function para subtrair a quantidade de pagamentos que deram errado
 */
export const ON_DELETE_PAYMENTS_INDEXERS: functions.CloudFunction<functions.database.DataSnapshot> = functions.database
  .ref('payments/paymentsList/{paymentId}')
  .onDelete(async (snapshot: functions.database.DataSnapshot) => {
    const totalPayments: database.Reference = await snapshot.ref.root.child('payments/paymentsIndexers/totalPayments');

    await totalPayments.transaction(payments => {
      return payments > 0 ? payments - 1 : 0;
    });
  });
