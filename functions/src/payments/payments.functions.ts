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

/**
 * Function para realizar a transferencia do saldo entre contas
 */
export const ON_CREATE_TRANSFER_BALANCE_BETWEEN_ACCOUNTS: functions.CloudFunction<
  functions.database.DataSnapshot
> = functions.database
  .ref('payments/paymentsList/{paymentId}')
  .onCreate(async (snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
    const paymentId: string = context.params.paymentId;
    const  paymentData = snapshot.val();
    const paymentValue = parseInt(paymentData.paymentAmountInCents);

    const balanceFromWhoPaid: database.Reference = await snapshot.ref.root.child(
      `users/usersList/${paymentData.userWhoPaid.userId}/private/userCurrentBalanceInCents`
    );

    const balanceFromWhoReceived: database.Reference = await snapshot.ref.root.child(
      `users/usersList/${paymentData.userWhoReceived.userId}/private/userCurrentBalanceInCents`
    );

    try {
      const paid = balanceFromWhoPaid.transaction((balanceWhoPaid: number) => {
        console.log("balanceWhoPaid", balanceWhoPaid);
        console.log("paymentValue", paymentValue);
        
        if (balanceWhoPaid < paymentValue) {
          throw new Error('O usuário que pagou não possui saldo suficiente. O pagamento será deletado');
        }

        return balanceWhoPaid - paymentValue;
      });

      const received = balanceFromWhoReceived.transaction((balanceWhoReceived: number) => {
        return balanceWhoReceived + paymentValue;
      });

      await Promise.all([ paid, received ]);
    } catch (error) {
      console.log(`Ocorreu um erro na transação. O pagamento ${paymentId} será deletado`);
      console.log(error);
      await snapshot.ref.root.child(`payments/paymentsList/${paymentId}`).remove();
    }
  });
