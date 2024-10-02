import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_ALL_TRANSACTIONS } from "../graphql/queries/transaction.query";
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from "../graphql/queries/user.query";

const Cards = () => {
  const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS);
  const { data: authUser } = useQuery(GET_AUTHENTICATED_USER);
  // const { data: userAndTransaction } = useQuery(GET_USER_AND_TRANSACTIONS, {
  //   variables: {
  //     userId: authUser?.authUser?._id,
  //   },
  // });

  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {!loading &&
          data?.transactions?.length > 0 &&
          data?.transactions?.map((transaction) => (
            <Card
              key={transaction?._id}
              transaction={transaction}
              authUser={authUser?.authUser}
            />
          ))}
      </div>
      {data?.transactions?.length === 0 && (
        <div className="text-center">
          <h1 className=" text-3xl">Transactions history not found!!!</h1>
        </div>
      )}
    </div>
  );
};
export default Cards;
