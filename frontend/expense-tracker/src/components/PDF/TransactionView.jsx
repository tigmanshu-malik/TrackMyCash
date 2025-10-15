// src/components/TransactionView.jsx
function TransactionView({ transactions }) {
    return (
      <div className="mt-6">
        {Object.keys(transactions).map((category) => (
          <div key={category} className="mb-4">
            <h2 className="text-xl font-bold capitalize">{category}</h2>
            <ul className="list-disc ml-6">
              {transactions[category].length > 0 ? (
                transactions[category].map((tx, index) => (
                  <li key={index}>{tx}</li>
                ))
              ) : (
                <li className="text-gray-400">No transactions</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  
  export default TransactionView;
  