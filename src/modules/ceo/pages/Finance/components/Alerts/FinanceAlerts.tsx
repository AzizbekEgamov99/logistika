import React from 'react';
import { Alert } from 'antd';

interface CashOverview {
  final_balance_usd?: number;
  total_debt_amount_usd?: number;
}

interface FinanceAlertsProps {
  cashOverview: CashOverview | null;
  error: string | null;
}

const FinanceAlerts: React.FC<FinanceAlertsProps> = ({ cashOverview, error }) => {
  if (!cashOverview && !error) return null;

  // Render error alert if there's an error
  if (error) {
    return (
      <Alert
        message="Xatolik"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }
  
  const alerts = [];

  // Check if balance is negative
  if (cashOverview?.final_balance_usd !== undefined && cashOverview.final_balance_usd < 0) {
    alerts.push(
      <Alert
        key="balance-alert"
        message="Diqqat! Moliyaviy holat salbiy!"
        description="Hozirgi vaqtda kassada mablag' yetarli emas. Iltimos, balansni tekshiring."
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  // Check if debt amount is high
  if (cashOverview?.total_debt_amount_usd !== undefined && cashOverview.total_debt_amount_usd > 10000) {
    alerts.push(
      <Alert
        key="debt-alert"
        message="Mijozlar qarzlari yuqori darajada!"
        description={`Umumiy qarzlar miqdori $${cashOverview.total_debt_amount_usd?.toLocaleString() || 0} USD ni tashkil etadi.`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return alerts.length ? (
    <div style={{ marginBottom: 16 }}>
      {alerts}
    </div>
  ) : null;
};

export default FinanceAlerts; 