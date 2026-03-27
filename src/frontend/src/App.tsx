import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

const profiles = [
  { id: "women/43", username: "@influencer_jane", followers: "12.9k" },
  { id: "men/34", username: "@thetravelguy", followers: "24.5k" },
  { id: "women/65", username: "@fit_kim", followers: "37.1k" },
  { id: "men/16", username: "@john_style", followers: "8.7k" },
  { id: "men/28", username: "@foodie_pndt", followers: "15.3k" },
  { id: "women/55", username: "@artsy_anna", followers: "19.2k" },
];

const pricingPlans = [
  {
    title: "Starter",
    amount: "2,000",
    desc: "For growing creators",
    price: "$9",
    tag: "Popular",
    productName: "Starter - 2,000 Instagram Followers",
    priceInCents: 900n,
  },
  {
    title: "Pro",
    amount: "10,000",
    desc: "Fuel your reach",
    price: "$29",
    tag: "Best Value",
    productName: "Pro - 10,000 Instagram Followers",
    priceInCents: 2900n,
  },
  {
    title: "Influencer",
    amount: "50,000",
    desc: "Level up big time",
    price: "$89",
    tag: null,
    productName: "Influencer - 50,000 Instagram Followers",
    priceInCents: 8900n,
  },
];

export default function App() {
  const { actor: backend } = useActor();
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(
    null,
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!backend) return;
    backend
      .isStripeConfigured()
      .then(setStripeConfigured)
      .catch(() => setStripeConfigured(false));
  }, [backend]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBuy = async (plan: (typeof pricingPlans)[0]) => {
    if (!backend) return;
    setLoadingPlan(plan.title);
    try {
      const url = await backend.createCheckoutSession(
        [
          {
            productName: plan.productName,
            currency: "usd",
            quantity: 1n,
            priceInCents: plan.priceInCents,
            productDescription: plan.desc,
          },
        ],
        window.location.href,
        window.location.href,
      );
      window.location.href = url;
    } catch {
      toast.error("Payment setup failed. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7fafc",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#222",
      }}
    >
      <Toaster />

      {/* Sticky Header */}
      <header
        style={{
          background: "linear-gradient(90deg, #2563eb, #60a5fa)",
          color: "#fff",
          padding: "1.5rem 0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 4px 8px rgba(0,40,120,0.05)",
        }}
      >
        <div style={{ maxWidth: 1150, margin: "0 auto", padding: "0 20px" }}>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: 2 }}
              data-ocid="header.section"
            >
              <i className="fab fa-instagram" style={{ marginRight: 6 }} />{" "}
              Followers 2008
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <button
                type="button"
                onClick={() => scrollTo("gallery")}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#1da1f2";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                data-ocid="nav.gallery.link"
              >
                Gallery
              </button>
              <button
                type="button"
                onClick={() => scrollTo("pricing")}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#1da1f2";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                data-ocid="nav.pricing.link"
              >
                Pricing
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Stripe not configured banner */}
      {stripeConfigured === false && (
        <div
          style={{
            background: "#fef9c3",
            borderBottom: "1px solid #fde68a",
            color: "#92400e",
            textAlign: "center",
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
          data-ocid="stripe.error_state"
        >
          <i
            className="fas fa-exclamation-triangle"
            style={{ marginRight: 8 }}
          />
          Payments are not yet configured. Please check back soon.
        </div>
      )}

      {/* Hero */}
      <section
        style={{
          padding: "110px 0 60px",
          textAlign: "center",
          background: "linear-gradient(180deg, #eff6ff 0%, #f7fafc 100%)",
        }}
      >
        <div style={{ maxWidth: 1150, margin: "0 auto", padding: "0 20px" }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: "3.2rem",
              fontWeight: 800,
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Boost your Instagram, the Pro way
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontSize: "1.25rem",
              color: "#4b5563",
              marginBottom: "2.5rem",
            }}
          >
            Discover how Followers 2008 helps you get visible, build real
            follower connections, and showcase your success on Instagram.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -2 }}
            onClick={() => scrollTo("gallery")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              fontSize: "1.2rem",
              padding: "1rem 2.5rem",
              borderRadius: 50,
              cursor: "pointer",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#60a5fa";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#2563eb";
            }}
            data-ocid="hero.primary_button"
          >
            <i className="fas fa-arrow-down" style={{ marginRight: 8 }} />
            See Gallery
          </motion.button>
        </div>
      </section>

      {/* Gallery Title */}
      <div
        id="gallery"
        style={{
          textAlign: "center",
          fontSize: "2.3rem",
          marginTop: 60,
          marginBottom: 40,
          fontWeight: 700,
          color: "#2563eb",
        }}
      >
        Featured Insta Profiles
      </div>

      {/* Gallery Grid */}
      <section
        style={{ maxWidth: 1150, margin: "0 auto", padding: "0 20px 40px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 30,
          }}
          data-ocid="gallery.list"
        >
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ boxShadow: "0 8px 36px rgba(37,99,235,0.11)" }}
              style={{
                background: "#fff",
                borderRadius: 20,
                boxShadow: "0 4px 16px rgba(34,38,55,0.06)",
                textAlign: "center",
                padding: "2rem 1.5rem 1.2rem",
              }}
              data-ocid={`gallery.item.${i + 1}`}
            >
              <img
                src={`https://randomuser.me/api/portraits/${profile.id}.jpg`}
                alt={profile.username}
                style={{
                  width: 66,
                  height: 66,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "3px solid #2563eb",
                  display: "block",
                  margin: "0 auto 1rem",
                }}
              />
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#2563eb",
                  marginBottom: "0.5rem",
                }}
              >
                {profile.username}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#4b5563" }}>
                <i className="fas fa-users" style={{ marginRight: 5 }} />
                {profile.followers} followers
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Title */}
      <div
        id="pricing"
        style={{
          textAlign: "center",
          fontSize: "2.3rem",
          marginTop: 60,
          marginBottom: 40,
          fontWeight: 700,
          color: "#2563eb",
        }}
      >
        Follower Packages
      </div>

      {/* Pricing Grid */}
      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}
        data-ocid="pricing.section"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 35,
          }}
        >
          {pricingPlans.map((plan, i) => {
            const isLoading = loadingPlan === plan.title;
            const isDisabled = stripeConfigured === false || !!loadingPlan;
            return (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 3px 24px rgba(37,99,235,0.09)",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  position: "relative",
                }}
                data-ocid={`pricing.item.${i + 1}`}
              >
                {plan.tag && (
                  <span
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                      background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                      color: "#fff",
                      fontSize: "0.8rem",
                      padding: "2px 14px",
                      borderRadius: 20,
                      fontWeight: 700,
                    }}
                  >
                    {plan.tag}
                  </span>
                )}
                <div
                  style={{
                    fontSize: "1.18rem",
                    color: "#222",
                    marginBottom: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {plan.title}
                </div>
                <div
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    marginBottom: "0.2rem",
                    color: "#2563eb",
                  }}
                >
                  {plan.amount}
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6b7280",
                    marginBottom: "1.2rem",
                  }}
                >
                  {plan.desc}
                </div>
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleBuy(plan)}
                  style={{
                    marginTop: 10,
                    padding: "0.8rem 2.2rem",
                    background: isDisabled ? "#93c5fd" : "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 40,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.2s",
                    minWidth: 160,
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#60a5fa";
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#2563eb";
                  }}
                  data-ocid={`pricing.primary_button.${i + 1}`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        style={{
                          width: 18,
                          height: 18,
                          animation: "spin 1s linear infinite",
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <title>Loading</title>
                        <path
                          d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                          strokeLinecap="round"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Buy for {plan.price}</>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#2563eb",
          color: "#e0eefe",
          textAlign: "center",
          padding: "34px 0 13px",
          marginTop: 30,
          letterSpacing: "0.5px",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          &copy; {new Date().getFullYear()} Followers 2008. All rights reserved.
          | Instagram Branding • Modern Blue Theme
        </p>
        <p style={{ fontSize: "0.85rem", opacity: 0.75, margin: 0 }}>
          Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#bfdbfe", textDecoration: "underline" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
