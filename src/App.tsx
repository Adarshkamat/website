import { useMemo, useState } from 'react'
import './App.css'

type Restaurant = {
  id: number
  name: string
  cuisine: string
  rating: string
  time: string
  price: string
  meal: string
  mealPrice: number
  deliveryMinutes: number
  category: string
  emoji: string
  color: string
  offer?: string
  tags: string[]
}

type CartLine = { restaurant: Restaurant; quantity: number }

const restaurants: Restaurant[] = [
  { id: 1, name: 'The Cozy Kitchen', cuisine: 'Comfort food · North Indian', rating: '4.8', time: '20–25 min', price: '₹200 for two', meal: 'Homestyle thali', mealPrice: 199, deliveryMinutes: 23, category: 'Indian', emoji: '🍛', color: 'peach', offer: '20% off up to ₹100', tags: ['Bestseller', 'Pure veg options'] },
  { id: 2, name: 'Little Italy', cuisine: 'Pizza · Pasta · Italian', rating: '4.6', time: '25–30 min', price: '₹350 for two', meal: 'Margherita pizza', mealPrice: 299, deliveryMinutes: 28, category: 'Pizza', emoji: '🍕', color: 'pink', offer: 'Free garlic bread', tags: ['Family favourite'] },
  { id: 3, name: 'Green Bowl Co.', cuisine: 'Healthy · Salads · Bowls', rating: '4.7', time: '15–20 min', price: '₹250 for two', meal: 'Rainbow power bowl', mealPrice: 249, deliveryMinutes: 18, category: 'Healthy', emoji: '🥗', color: 'mint', offer: '15% off your first order', tags: ['Fresh & light'] },
  { id: 4, name: 'Wok This Way', cuisine: 'Chinese · Asian · Noodles', rating: '4.5', time: '20–30 min', price: '₹300 for two', meal: 'Veggie noodle bowl', mealPrice: 219, deliveryMinutes: 25, category: 'Chinese', emoji: '🍜', color: 'lilac', tags: ['Popular near you'] },
  { id: 5, name: 'Burger Barn', cuisine: 'Burgers · Snacks · American', rating: '4.4', time: '20–25 min', price: '₹280 for two', meal: 'Classic garden burger', mealPrice: 229, deliveryMinutes: 22, category: 'Burgers', emoji: '🍔', color: 'yellow', offer: 'Buy 1 get 1 on fries', tags: ['Kids love it'] },
  { id: 6, name: 'Sweet Moments', cuisine: 'Desserts · Cakes · Bakery', rating: '4.9', time: '15–20 min', price: '₹180 for two', meal: 'Chocolate celebration cake', mealPrice: 179, deliveryMinutes: 17, category: 'Desserts', emoji: '🍰', color: 'blue', tags: ['Treat yourself'] },
]

const categories = [
  { name: 'All', emoji: '✨' }, { name: 'Indian', emoji: '🍛' }, { name: 'Pizza', emoji: '🍕' },
  { name: 'Healthy', emoji: '🥗' }, { name: 'Chinese', emoji: '🍜' }, { name: 'Burgers', emoji: '🍔' }, { name: 'Desserts', emoji: '🍰' },
]

function App() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recommended')
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [message, setMessage] = useState('')

  const visibleRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase()
    return restaurants
      .filter((restaurant) => category === 'All' || restaurant.category === category)
      .filter((restaurant) => !onlyOffers || restaurant.offer)
      .filter((restaurant) => !query || `${restaurant.name} ${restaurant.cuisine} ${restaurant.category}`.toLowerCase().includes(query))
      .sort((a, b) => sort === 'rating' ? Number(b.rating) - Number(a.rating) : sort === 'fastest' ? a.deliveryMinutes - b.deliveryMinutes : a.id - b.id)
  }, [category, onlyOffers, search, sort])

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.quantity * item.restaurant.mealPrice, 0)

  function addToCart(restaurant: Restaurant) {
    setCart((current) => {
      const existing = current.find((item) => item.restaurant.id === restaurant.id)
      return existing
        ? current.map((item) => item.restaurant.id === restaurant.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { restaurant, quantity: 1 }]
    })
    setMessage(`${restaurant.name} added to your basket`)
    window.setTimeout(() => setMessage(''), 2400)
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) => current
      .map((item) => item.restaurant.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0))
  }

  function checkout() {
    setCart([])
    setCartOpen(false)
    setMessage('Order placed! Your tasty food is on its way 🎉')
    window.setTimeout(() => setMessage(''), 4000)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="FoodKart home"><span className="brand-mark">f<span>k</span></span><span>FoodKart<span className="brand-dot">.</span></span></a>
        <button className="delivery-location" type="button" onClick={() => setMessage('Delivery location: Indiranagar, Bengaluru')} aria-label="Delivery location, Indiranagar, Bengaluru">
          <span className="location-pin">⌖</span><span className="location-copy"><small>Delivering to</small><strong>Indiranagar, Bengaluru <span>⌄</span></strong></span>
        </button>
        <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search restaurants or food" placeholder="Search for food, restaurants..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label>
        <div className="header-actions"><button className="help-button" type="button" onClick={() => setMessage('Need help? Our friendly support team is here for you.')}>Help</button><button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Open basket with ${itemCount} items`}><span aria-hidden="true">♧</span><span className="cart-label">Basket</span>{itemCount > 0 && <b>{itemCount}</b>}</button></div>
      </header>

      <main id="home">
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot" /> GOOD FOOD, GOOD MOOD</div><h1>What sounds <span>good?</span></h1><p>Delicious moments are just a few taps away.</p></div><div className="delivery-note"><span>🛵</span><div><strong>At your door in 25 min</strong><small>Fresh, fast & made with care</small></div></div></section>

        <section className="hero-banner" aria-label="Welcome offer"><div className="hero-copy"><span className="hero-kicker">A little treat for you</span><h2>Good food.<br /><em>Great mood.</em></h2><p>Get up to 40% off your first three orders.</p><button type="button" className="hero-cta" onClick={() => { setOnlyOffers(true); document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore offers <span>→</span></button><div className="hero-dots"><i /><i /><i /></div></div><div className="hero-art" aria-hidden="true"><div className="sunburst" /><span className="hero-food hero-food-one">🍕</span><span className="hero-food hero-food-two">🍟</span><span className="hero-food hero-food-three">🥤</span><span className="hero-sparkle sparkle-one">✦</span><span className="hero-sparkle sparkle-two">✦</span><span className="hero-bubble">Yum!</span></div><div className="hero-side-label">MADE FOR YOUR HAPPY PLACE</div></section>

        <section className="category-section" aria-labelledby="category-heading"><div className="section-heading"><div><span className="section-eyebrow">FIND YOUR FAVOURITE</span><h2 id="category-heading">Browse by mood</h2></div><button className="text-button" type="button" onClick={() => { setCategory('All'); setOnlyOffers(false) }}>See all <span>→</span></button></div><div className="category-list" role="group" aria-label="Food categories">{categories.map((item) => <button key={item.name} type="button" className={`category-chip ${category === item.name ? 'selected' : ''}`} onClick={() => setCategory(item.name)} aria-pressed={category === item.name}><span className="category-emoji">{item.emoji}</span><span>{item.name}</span></button>)}</div></section>

        <section className="restaurant-section" id="restaurants" aria-labelledby="restaurant-heading"><div className="section-heading restaurant-heading"><div><span className="section-eyebrow">HAND-PICKED FOR YOU</span><h2 id="restaurant-heading">Popular near you <span className="heading-spark">✦</span></h2><p className="section-description">Lovely places, lovely plates. Here's what's cooking.</p></div><div className="restaurant-controls"><button className={`filter-button ${onlyOffers ? 'active' : ''}`} type="button" onClick={() => setOnlyOffers(!onlyOffers)} aria-pressed={onlyOffers}><span>⚑</span> Offers</button><label className="sort-select"><span className="sr-only">Sort restaurants</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="fastest">Fastest delivery</option></select><span aria-hidden="true">⌄</span></label></div></div>
          {visibleRestaurants.length ? <div className="restaurant-grid">{visibleRestaurants.map((restaurant) => <article className="restaurant-card" key={restaurant.id}><div className={`restaurant-art ${restaurant.color}`}><span className="food-illustration" aria-hidden="true">{restaurant.emoji}</span><span className="art-caption">FRESHLY<br />MADE</span>{restaurant.offer && <span className="offer-ribbon">{restaurant.offer}</span>}<button className={`favorite-button ${favorites.includes(restaurant.id) ? 'is-favorite' : ''}`} type="button" aria-label={`${favorites.includes(restaurant.id) ? 'Remove' : 'Add'} ${restaurant.name} ${favorites.includes(restaurant.id) ? 'from' : 'to'} favourites`} aria-pressed={favorites.includes(restaurant.id)} onClick={() => setFavorites((current) => current.includes(restaurant.id) ? current.filter((id) => id !== restaurant.id) : [...current, restaurant.id])}>{favorites.includes(restaurant.id) ? '♥' : '♡'}</button><span className="delivery-time">◷ {restaurant.time}</span></div><div className="restaurant-info"><div className="restaurant-title-row"><h3>{restaurant.name}</h3><span className="rating"><span>★</span> {restaurant.rating}</span></div><p>{restaurant.cuisine}</p><div className="restaurant-meta"><span>{restaurant.price}</span><span className="meta-divider">·</span><span>{restaurant.tags[0]}</span></div><div className="restaurant-bottom"><span className="open-status"><i /> Open now</span><button className="add-button" type="button" onClick={() => addToCart(restaurant)} aria-label={`Add ${restaurant.meal} to basket for ₹${restaurant.mealPrice}`}><span aria-hidden="true">+</span> Add · ₹{restaurant.mealPrice}</button></div></div></article>)}</div> : <div className="empty-results"><span>🍽️</span><h3>No dishes on this menu just yet</h3><p>Try another category or search for something else.</p><button type="button" className="text-button" onClick={() => { setCategory('All'); setSearch(''); setOnlyOffers(false) }}>Clear filters →</button></div>}
        </section>

        <section className="comfort-banner"><div className="comfort-icon">💛</div><div><strong>A little comfort, delivered.</strong><p>Carefully packed, thoughtfully made, always delicious.</p></div><button type="button" onClick={() => setMessage('We are glad you are here. Enjoy exploring FoodKart!')}>Our promise <span>→</span></button></section>
      </main>
      <footer><span className="footer-brand">FoodKart<span>.</span></span><span>Good food brings us together.</span><span>Made with <b>♥</b> for every appetite</span></footer>

      {message && <div className="toast" role="status">{message}</div>}
      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-heading" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="section-eyebrow">YOUR GOODIES</span><h2 id="cart-heading">Your basket <span>({itemCount})</span></h2></div><button type="button" className="close-button" aria-label="Close basket" onClick={() => setCartOpen(false)}>×</button></div>{cart.length ? <><div className="cart-lines">{cart.map(({ restaurant, quantity }) => <div className="cart-line" key={restaurant.id}><span className={`cart-food ${restaurant.color}`}>{restaurant.emoji}</span><div className="cart-line-copy"><strong>{restaurant.meal}</strong><small>{restaurant.name}</small><b>₹{restaurant.mealPrice}</b></div><div className="quantity-control"><button type="button" aria-label={`Remove one ${restaurant.meal}`} onClick={() => changeQuantity(restaurant.id, -1)}>−</button><span>{quantity}</span><button type="button" aria-label={`Add one ${restaurant.meal}`} onClick={() => changeQuantity(restaurant.id, 1)}>+</button></div></div>)}</div><div className="cart-summary"><p><span>Subtotal</span><strong>₹{cartTotal}</strong></p><p><span>Delivery</span><strong className="free-delivery">FREE</strong></p><div className="total-row"><span>Total</span><strong>₹{cartTotal}</strong></div><button type="button" className="checkout-button" onClick={checkout}>Place your order <span>→</span></button><small className="checkout-note">A demo checkout — no payment needed</small></div></> : <div className="empty-cart"><span>🧺</span><h3>Your basket is taking a nap</h3><p>Add something delicious and we'll bring it right to you.</p><button type="button" className="checkout-button" onClick={() => setCartOpen(false)}>Explore restaurants <span>→</span></button></div>}</aside></div>}
    </div>
  )
}

export default App
