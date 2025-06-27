import React, { useState, useEffect } from 'react';
import instance from '@/api/axios';
import { toast } from 'sonner';

const ExchangeRateForm: React.FC = () => {
  const [cdfToUsdRate, setCdfToUsdRate] = useState<number>(2500);
  const [isEditing, setIsEditing] = useState(false);
  const [tempRate, setTempRate] = useState<string>('2500');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
  const fetchRate = async () => {
    try {
      const response = await instance.get('/exchange-rate/latest');
      const { usdToFc, updatedAt } = response.data;
      setCdfToUsdRate(usdToFc);
      setTempRate(usdToFc.toString());
      setLastUpdated(updatedAt);
    } catch (error) {
      toast.error('Erreur lors du chargement du taux');
    }
  };

  fetchRate();
}, []);

  const handleSave = async () => {
    const newRate = parseFloat(tempRate);
    if (isNaN(newRate) || newRate <= 0) {
      toast.error("Veuillez entrer un taux valide (nombre positif)");
      return;
    }

    try {
      await instance.post('/exchange-rate', { usdToFc: newRate });
      setCdfToUsdRate(newRate);
      setIsEditing(false);
      setLastUpdated(new Date().toLocaleDateString());
      toast.success("Taux de change mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium">Franc Congolais (CDF) / Dollar US (USD)</h4>
            {isEditing ? (
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="number"
                  value={tempRate}
                  onChange={(e) => setTempRate(e.target.value)}
                  className="w-24 px-2 py-1 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  step="0.01"
                  min="0.01"
                />
                <span className="text-sm text-muted-foreground">CDF pour 1 USD</span>
              </div>
            ) : (
              <p className="text-xl font-medium">1 USD = {cdfToUsdRate.toFixed(2)} CDF</p>
            )}
          </div>

          <div>
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setTempRate(cdfToUsdRate.toString());
                }}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors"
              >
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Le taux de change est utilisé pour afficher les montants en devise secondaire sur les reçus.</p>
        <p>Dernière mise à jour : {lastUpdated || 'Inconnue'}</p>
      </div>
    </div>
  );
};

export default ExchangeRateForm;
