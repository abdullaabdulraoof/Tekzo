<h1>Tekzo – Full Stack E-Commerce Platform</h1>

<p>
  <img src="https://img.shields.io/badge/Frontend-React-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/API-Express.js-lightgrey?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Payments-Razorpay-blue?logo=razorpay" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens" alt="JWT" />
  <img src="https://img.shields.io/badge/API%20Testing-Postman-orange?logo=postman" alt="Postman" />
</p>

Live Demo: (https://tekzo-2j88.vercel.app)

<p>Tekzo is a full-featured MERN stack e-commerce platform. Users can browse, filter, sort, and purchase products with secure JWT authentication and integrated Razorpay payments. Dedicated admin tools make user, order, and product management seamless.</p>

<h2>Features</h2>

<h3>User</h3>
<ul>
  <li>Register/login (JWT + Google)</li>
  <li>Product search, category filter, sorting, pagination</li>
  <li>Product detail pages with images</li>
  <li>Cart & wishlist management</li>
  <li>Checkout (COD & online payment via Razorpay)</li>
  <li>Order history</li>
  <li>Account/profile/address management</li>
</ul>

<h3>Admin</h3>
<ul>
  <li>Secure admin login</li>
  <li>Product/category CRUD</li>
  <li>Order management</li>
  <li>User activation/deactivation</li>
  <li>Admin dashboard with overview</li>
</ul>

<h2>Tech Stack</h2>
<table>
  <thead>
    <tr>
      <th>Area</th>
      <th>Technology</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Frontend</td>
      <td>React, React Router, Tailwind CSS, Axios, Context API</td>
    </tr>
    <tr>
      <td>Backend</td>
      <td>Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js</td>
    </tr>
    <tr>
      <td>Payments</td>
      <td>Razorpay</td>
    </tr>
    <tr>
      <td>Auth</td>
      <td>JWT, Google OAuth</td>
    </tr>
    <tr>
      <td>Testing</td>
      <td>Postman</td>
    </tr>
  </tbody>
</table>

<h2>Installation & Setup</h2>

<h3>1. Clone</h3>
<pre>
<code>git clone https://github.com/abdullaabdulraoof/Tekzo.git
cd Tekzo
</code>
</pre>

<h3>2. Backend</h3>
<pre>
<code>cd Backend
npm install
</code>
</pre>

<p>Create a <code>.env</code> file in <code>Backend/</code> based on .env.example:</p>
<pre>
<code>PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
</code>
</pre>

<p>Start backend server:</p>
<pre>
<code>npm run dev
</code>
</pre>

<h3>3. Frontend</h3>
<pre>
<code>cd ../Frontend
npm install
npm start
</code>
</pre>

<h2>API Testing (Postman)</h2>
<p>Import the provided collections:</p>
<ul>
  <li><code>User.postman_collection.json</code></li>
  <li><code>Admin.postman_collection.json</code></li>
</ul>
<p>Test endpoints: authentication, product management, cart, wishlist, orders.</p>

<h2>Project Structure</h2>
<pre>
<code>Tekzo/
│── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── util/
│── Frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── styles/
│── User.postman_collection.json
│── Admin.postman_collection.json
</code>
</pre>

<h2>Future Enhancements</h2>
<ul>
  <li>Product reviews & ratings</li>
  <li>Stock management</li>
  <li>Coupon codes & discounts</li>
  <li>Order notifications</li>
  <li>Progressive Web App (PWA) support</li>
</ul>

Sure — here’s a clean, production-ready HTML version of your CI/CD section that you can paste into your README (if rendering HTML), an HTML file, or a project docs page:


  <h2>CI/CD</h2>

  <p>This project uses <strong>CI/CD pipelines</strong> for automatic deployment:</p>

  <ul>
    <li>
      <strong>Frontend</strong> is deployed on <strong>Vercel</strong><br>
      Every push to the <code>main</code> branch triggers a build and deployment.<br>
      The live demo is always up to date: 
      <a href="https://tekzo-2j88.vercel.app" target="_blank" rel="noopener noreferrer">Tekzo Live</a>
    </li>

    <li style="margin-top:0.75rem;">
      <strong>Backend</strong> is deployed on <strong>Render</strong><br>
      Backend APIs are automatically deployed and updated from the GitHub repository.<br>
      Base URL: <a href="https://tekzo.onrender.com/api" target="_blank" rel="noopener noreferrer">https://tekzo.onrender.com/api</a>
    </li>
  </ul>

<h2>Author</h2>
<p>Abdulla Abdul Raoof<br>
B.Tech Computer Science & Engineering (2025)<br>
<a href="https://github.com/abdullaabdulraoof">GitHub</a></p>
