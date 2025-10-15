# TrackMyCash-A Smart Expense Tracker

TrackMyCash is a React-based personal finance management application designed to help users track their income, expenses, and overall financial health. It integrates with the Plaid API to fetch financial data (e.g., card transactions) and uses MongoDB for data storage. The app features an intuitive interface with transaction management, financial overviews, and data visualizations through charts, along with user authentication and profile management.


**Login Page**

![image alt](https://github.com/AnkitKumar729/TrackMyCash-Smart-Expense-Tracker/blob/0652ce8d9d1d3a8cff6961e913b18376a88a5c61/Login.png)

**Sign-Up Page**

![image alt](https://github.com/AnkitKumar729/TrackMyCash-Smart-Expense-Tracker/blob/0652ce8d9d1d3a8cff6961e913b18376a88a5c61/Sign-up.png)

**Main Dashboard**

![image alt](https://github.com/AnkitKumar729/TrackMyCash-Smart-Expense-Tracker/blob/68f0ba9f2fe10a48af5f8e60c1a830f29314ed6b/Dashboard.png)

**View your financial overview, recent transactions, and income/expense trends.**

![image alt](https://github.com/AnkitKumar729/TrackMyCash-Smart-Expense-Tracker/blob/68f0ba9f2fe10a48af5f8e60c1a830f29314ed6b/Income.png)

**Real-time Sync with Cards**

![image alt](https://github.com/AnkitKumar729/TrackMyCash-Smart-Expense-Tracker/blob/68f0ba9f2fe10a48af5f8e60c1a830f29314ed6b/Cards.png)

**Charts**

![image alt](https://github.com/AnkitKumar729/TrackMyCash-Smart-Expense-Tracker/blob/0f131d2bf023cb50473b6f585fb79251ba9bc388/Graphs.png)



**Environment Variables**

Create a .env file in the project root and configure the following variables. Do not use the example credentials provided in the repository's documentation, as they are sensitive. Obtain your own credentials for MongoDB and Plaid.

**MONGODB_URI**=your_mongodb_uri_here

**JWT_SECRET**=your_jwt_secret_here

**PORT**=8000

**PLAID_CLIENT_ID**=your_plaid_client_id_here

**PLAID_SECRET**=your_plaid_secret_here

**PLAID_ENV**=sandbox
