import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  verifyUrl: string;
}


export function EmailTemplate({ email, verifyUrl }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your B-Fanel subscription</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f0f2f5",
          fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
        }}
      >
        {/* ── Outer wrapper ── */}
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: "#f0f2f5", padding: "40px 16px" }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  width="600"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    maxWidth: "600px",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                  }}
                >
                  <tbody>

                    {/* ══ TOP ACCENT BAR ══ */}
                    <tr>
                      <td
                        style={{
                          height: "4px",
                          background:
                            "linear-gradient(90deg, #f97316, #fb923c, #f97316)",
                        }}
                      />
                    </tr>

                    {/* ══ HERO BANNER ══ */}
                    <tr>
                      <td
                        style={{
                          background:
                            "linear-gradient(135deg, #1e2840 0%, #0f1624 60%, #1e2840 100%)",
                          padding: "40px 48px 48px 48px",
                        }}
                      >
                        {/* Brand */}
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "26px",
                            fontWeight: 700,
                            color: "#ffffff",
                            margin: "0 0 4px 0",
                            letterSpacing: "1px",
                          }}
                        >
                          B-Fanel
                          <span style={{ color: "#f97316" }}>.</span>
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            margin: "0 0 32px 0",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                          }}
                        >
                          Industries Limited
                        </p>

                        {/* Decorative orange rule */}
                        <div
                          style={{
                            width: "48px",
                            height: "3px",
                            backgroundColor: "#f97316",
                            borderRadius: "2px",
                            marginBottom: "20px",
                          }}
                        />

                        {/* Hero headline */}
                        <h1
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "34px",
                            fontWeight: 700,
                            color: "#ffffff",
                            margin: "0 0 14px 0",
                            lineHeight: "1.25",
                          }}
                        >
                          One Click Away
                          <br />
                          <span style={{ color: "#f97316" }}>from the Inside.</span>
                        </h1>

                        <p
                          style={{
                            fontSize: "15px",
                            color: "#94a3b8",
                            margin: "0",
                            lineHeight: "1.75",
                          }}
                        >
                          You're joining Nigeria's leading PVC pipe manufacturing
                          newsletter. Verify your email to start receiving exclusive
                          updates, product launches, and industry insights.
                        </p>
                      </td>
                    </tr>

                    {/* ══ BODY ══ */}
                    <tr>
                      <td style={{ padding: "48px 48px 0 48px" }}>

                        {/* Icon badge */}
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "#fff7ed",
                            border: "2px solid #fed7aa",
                            textAlign: "center",
                            lineHeight: "60px",
                            fontSize: "26px",
                            marginBottom: "24px",
                          }}
                        >
                          ✉️
                        </div>

                        <p
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "2.5px",
                            margin: "0 0 8px 0",
                          }}
                        >
                          Email Verification
                        </p>

                        <h2
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "24px",
                            color: "#1e2840",
                            margin: "0 0 16px 0",
                          }}
                        >
                          Confirm your subscription
                        </h2>

                        <p
                          style={{
                            fontSize: "15px",
                            color: "#475569",
                            lineHeight: "1.75",
                            margin: "0 0 10px 0",
                          }}
                        >
                          We received a newsletter signup request for:
                        </p>

                        {/* Email pill */}
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor: "#f8fafc",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "10px 18px",
                            marginBottom: "24px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#1e2840",
                              fontWeight: 600,
                            }}
                          >
                            📧 {email}
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: "15px",
                            color: "#475569",
                            lineHeight: "1.75",
                            margin: "0 0 32px 0",
                          }}
                        >
                          Click the button below to verify your email and activate
                          your subscription. This link expires in{" "}
                          <span style={{ color: "#f97316", fontWeight: 600 }}>
                            24 hours
                          </span>
                          .
                        </p>

                        {/* CTA Button */}
                        <a
                          href={verifyUrl}
                          style={{
                            display: "block",
                            backgroundColor: "#f97316",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: 700,
                            textDecoration: "none",
                            textAlign: "center",
                            padding: "16px 32px",
                            borderRadius: "10px",
                            letterSpacing: "0.4px",
                            boxShadow: "0 4px 20px rgba(249, 115, 22, 0.35)",
                          }}
                        >
                          ✅ &nbsp; Verify My Email Address
                        </a>
                      </td>
                    </tr>

                    {/* ══ FALLBACK LINK ══ */}
                    <tr>
                      <td style={{ padding: "24px 48px 0 48px" }}>
                        <div
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "16px 20px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              margin: "0 0 6px 0",
                            }}
                          >
                            Button not working? Copy and paste this link into your browser:
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#f97316",
                              margin: "0",
                              wordBreak: "break-all",
                            }}
                          >
                            {verifyUrl}
                          </p>
                        </div>
                      </td>
                    </tr>

                    {/* ══ DIVIDER ══ */}
                    <tr>
                      <td style={{ padding: "40px 48px 0 48px" }}>
                        <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: 0 }} />
                      </td>
                    </tr>

                    {/* ══ PERKS ══ */}
                    <tr>
                      <td style={{ padding: "32px 48px 0 48px" }}>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            margin: "0 0 20px 0",
                          }}
                        >
                          What you'll receive
                        </p>

                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              {[
                                { bg: "#fff7ed", icon: "🏭", label: "Product Launches" },
                                { bg: "#f0f9ff", icon: "📊", label: "Industry Insights" },
                                { bg: "#f0fdf4", icon: "🎯", label: "Exclusive Deals" },
                              ].map((perk, i) => (
                                <td
                                  key={i}
                                  width="33%"
                                  style={{ paddingRight: i < 2 ? "10px" : "0" }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: perk.bg,
                                      borderRadius: "10px",
                                      padding: "16px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <p style={{ fontSize: "22px", margin: "0 0 8px 0" }}>
                                      {perk.icon}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        color: "#1e2840",
                                        fontWeight: 600,
                                        margin: "0",
                                        lineHeight: "1.4",
                                      }}
                                    >
                                      {perk.label}
                                    </p>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* ══ FOOTER ══ */}
                    <tr>
                      <td
                        style={{
                          padding: "40px 48px",
                          marginTop: "40px",
                          backgroundColor: "#f8fafc",
                          borderTop: "1px solid #e2e8f0",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#1e2840",
                            margin: "0 0 4px 0",
                          }}
                        >
                          B-Fanel<span style={{ color: "#f97316" }}>.</span>
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            margin: "0 0 20px 0",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                          }}
                        >
                          Industries Limited
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#94a3b8",
                            margin: "0 0 8px 0",
                            lineHeight: "1.6",
                          }}
                        >
                          Nigeria's trusted PVC pipe manufacturer.
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#cbd5e1",
                            margin: "0",
                            lineHeight: "1.7",
                          }}
                        >
                          If you didn't sign up for this newsletter, you can safely
                          ignore this email. No further emails will be sent unless
                          you verify.
                        </p>
                      </td>
                    </tr>

                    {/* ══ BOTTOM ACCENT BAR ══ */}
                    <tr>
                      <td
                        style={{
                          height: "4px",
                          background:
                            "linear-gradient(90deg, #1e2840, #f97316, #1e2840)",
                        }}
                      />
                    </tr>

                  </tbody>
                </table>

                {/* Below-card copyright */}
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginTop: "16px",
                  }}
                >
                  © {new Date().getFullYear()} B-Fanel Industries Limited · Nigeria
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}