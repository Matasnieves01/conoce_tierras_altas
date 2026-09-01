import React, { useState } from "react";
import type { ReservationItem, PackageInfo } from "./PackageDetail";

interface CheckoutPageProps {
  reservations: ReservationItem[];
  allPackages: PackageInfo[];
  onBack: () => void;
  onUpdateReservations: (updated: ReservationItem[]) => void;
}

interface AttendeeInfo {
  fullName: string;
  documentId: string;
}

export function CheckoutPage({
  reservations,
  onBack,
  onUpdateReservations,
}: CheckoutPageProps) {
  const [step, setStep] = useState<"attendees" | "payment" | "success">("attendees");
  
  // Contact and attendee data
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [attendeesMap, setAttendeesMap] = useState<Record<string, AttendeeInfo[]>>(() => {
    const initial: Record<string, AttendeeInfo[]> = {};
    reservations.forEach((item) => {
      initial[item.packageId] = Array.from({ length: item.peopleCount }, () => ({
        fullName: "",
        documentId: "",
      }));
    });
    return initial;
  });

  // Payment data
  const [selectedMethod, setSelectedMethod] = useState<"yappy" | "transferencia">("yappy");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");

  const totalCartPrice = reservations.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleAttendeeChange = (packageId: string, index: number, field: keyof AttendeeInfo, value: string) => {
    setAttendeesMap((prev) => {
      const list = [...(prev[packageId] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [packageId]: list };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate attendees
    for (const item of reservations) {
      const attendees = attendeesMap[item.packageId] || [];
      for (const att of attendees) {
        if (!att.fullName.trim() || !att.documentId.trim()) {
          alert("Por favor completa el nombre y cédula/pasaporte de todos los asistentes para cada tour.");
          return;
        }
      }
    }
    if (!clientEmail.trim()) {
      alert("Por favor ingresa un correo electrónico válido para enviar tu comprobante.");
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      alert("Por favor adjunta la captura o comprobante de tu pago por Yappy o Transferencia.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API registration & generating secure verification code for admin review
    setTimeout(() => {
      const randomCode = "CTA-" + Math.floor(100000 + Math.random() * 900000);
      setRegistrationCode(randomCode);
      setIsSubmitting(false);
      setStep("success");
      onUpdateReservations(reservations);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

  if (reservations.length === 0 && step !== "success") {
    return (
      <div className="package-detail-page">
        <div className="package-detail__container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <h2>No tienes reservas activas en este momento.</h2>
          <p style={{ margin: "1rem 0 2rem", color: "#666" }}>Explora nuestros paquetes y agrega experiencias a tu carrito.</p>
          <button type="button" className="btn btn--primary" onClick={onBack}>
            Ver paquetes disponibles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="package-detail-page">
      <header className="package-detail__hero-topbar" style={{ padding: "1.5rem 2rem", background: "#112217" }}>
        <button type="button" className="btn btn--secondary package-detail__back-btn" onClick={onBack}>
          ← Volver
        </button>
      </header>

      <div className="package-detail__container" style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
        {step === "attendees" && (
          <div className="checkout-card" style={{ background: "#fff", borderRadius: "16px", padding: "2.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ marginBottom: "2rem" }}>
              <span className="about-section__eyebrow">Paso 1 de 2</span>
              <h2>Información de los participantes</h2>
              <p style={{ color: "#666" }}>Ingresa los datos personales de cada asistente y el correo donde enviaremos tu número de registro.</p>
            </div>

            <form onSubmit={handleProceedToPayment}>
              <div style={{ marginBottom: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+507 6000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>

              {reservations.map((item) => (
                <div key={item.packageId} style={{ marginBottom: "2.5rem", background: "#f9fbf9", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <img src={item.packageImage} alt={item.packageTitle} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{item.packageTitle}</h4>
                      <span style={{ fontSize: "0.85rem", color: "#666" }}>📅 {item.displayDate} | 👥 {item.peopleCount} personas</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {Array.from({ length: item.peopleCount }).map((_, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "center", background: "#fff", padding: "1rem", borderRadius: "8px", border: "1px solid #eaeaea" }}>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#444", display: "block", marginBottom: "0.3rem" }}>
                            Asistente #{idx + 1} - Nombre completo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nombre y apellido"
                            value={attendeesMap[item.packageId]?.[idx]?.fullName || ""}
                            onChange={(e) => handleAttendeeChange(item.packageId, idx, "fullName", e.target.value)}
                            style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#444", display: "block", marginBottom: "0.3rem" }}>
                            Cédula o Pasaporte *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. 4-700-1234"
                            value={attendeesMap[item.packageId]?.[idx]?.documentId || ""}
                            onChange={(e) => handleAttendeeChange(item.packageId, idx, "documentId", e.target.value)}
                            style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
                <div>
                  <span style={{ fontSize: "0.9rem", color: "#666" }}>Total a pagar:</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#112217" }}>${totalCartPrice}</div>
                </div>
                <button type="submit" className="btn btn--primary" style={{ padding: "0.85rem 2rem" }}>
                  Continuar al pago →
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "payment" && (
          <div className="checkout-card" style={{ background: "#fff", borderRadius: "16px", padding: "2.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ marginBottom: "2rem" }}>
              <span className="about-section__eyebrow">Paso 2 de 2</span>
              <h2>Métodos de pago y comprobante</h2>
              <p style={{ color: "#666" }}>Realiza tu pago mediante Yappy o Transferencia Bancaria y adjunta la captura para validación del administrador.</p>
            </div>

            <div style={{ background: "#fdfefe", border: "1px solid #dcdcdc", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem" }}>
              <h4 style={{ margin: "0 0 1rem 0" }}>💳 Datos para realizar el pago:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ padding: "1rem", background: "#fff", borderRadius: "8px", border: "1px solid #eee" }}>
                  <strong>📱 Yappy (Banco General)</strong>
                  <p style={{ margin: "0.5rem 0 0", color: "#555" }}>Directorio: <strong>ConoceTierrasAltas</strong></p>
                  <p style={{ margin: "0.2rem 0 0", color: "#555" }}>Celular: <strong>+507 6000-0000</strong></p>
                </div>
                <div style={{ padding: "1rem", background: "#fff", borderRadius: "8px", border: "1px solid #eee" }}>
                  <strong>🏦 Transferencia Bancaria</strong>
                  <p style={{ margin: "0.5rem 0 0", color: "#555" }}>Banco: <strong>Banco General (Cuenta Corriente)</strong></p>
                  <p style={{ margin: "0.2rem 0 0", color: "#555" }}>Número: <strong>03-01-01-999999-9</strong></p>
                  <p style={{ margin: "0.2rem 0 0", color: "#555" }}>Nombre: <strong>Conoce Tierras Altas S.A.</strong></p>
                </div>
              </div>
              <div style={{ marginTop: "1rem", textAlign: "right", fontWeight: "bold", fontSize: "1.1rem" }}>
                Monto Exacto: <span style={{ color: "#2b7a4b" }}>${totalCartPrice}</span>
              </div>
            </div>

            <form onSubmit={handleFinalSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Selecciona tu método de pago utilizado *</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <label style={{ flex: 1, padding: "1rem", border: selectedMethod === "yappy" ? "2px solid #2b7a4b" : "1px solid #ccc", borderRadius: "8px", cursor: "pointer", background: selectedMethod === "yappy" ? "#f4fbf6" : "#fff" }}>
                    <input type="radio" name="paymentMethod" checked={selectedMethod === "yappy"} onChange={() => setSelectedMethod("yappy")} style={{ marginRight: "0.5rem" }} />
                    Yappy
                  </label>
                  <label style={{ flex: 1, padding: "1rem", border: selectedMethod === "transferencia" ? "2px solid #2b7a4b" : "1px solid #ccc", borderRadius: "8px", cursor: "pointer", background: selectedMethod === "transferencia" ? "#f4fbf6" : "#fff" }}>
                    <input type="radio" name="paymentMethod" checked={selectedMethod === "transferencia"} onChange={() => setSelectedMethod("transferencia")} style={{ marginRight: "0.5rem" }} />
                    Transferencia Bancaria
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Adjuntar comprobante de pago (Captura o PDF) *</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleFileChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc", background: "#fafafa" }}
                />
                {receiptPreview && (
                  <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>Vista previa del comprobante:</p>
                    <img src={receiptPreview} alt="Comprobante" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" className="btn btn--secondary" onClick={() => setStep("attendees")}>
                  ← Volver a asistentes
                </button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting} style={{ padding: "0.85rem 2.5rem" }}>
                  {isSubmitting ? "Enviando registro..." : "Enviar comprobante y registrarme 🚀"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="checkout-card" style={{ background: "#fff", borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
            <h2>¡Registro enviado con éxito!</h2>
            <p style={{ color: "#666", maxWidth: "600px", margin: "1rem auto 2rem" }}>
              Hemos recibido tu comprobante de pago y la información de los asistentes. Se ha enviado un correo de confirmación provisional a <strong>{clientEmail}</strong>.
            </p>

            <div style={{ background: "#f4fbf6", border: "1px dashed #2b7a4b", padding: "1.5rem", borderRadius: "12px", maxWidth: "400px", margin: "0 auto 2rem" }}>
              <span style={{ fontSize: "0.85rem", color: "#555", display: "block" }}>Tu código de verificación de registro:</span>
              <strong style={{ fontSize: "1.8rem", color: "#2b7a4b", letterSpacing: "2px" }}>{registrationCode}</strong>
              <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.5rem 0 0" }}>Un administrador revisará tu pago en breve y te enviará la confirmación definitiva.</p>
            </div>

            <button type="button" className="btn btn--primary" onClick={onBack}>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;