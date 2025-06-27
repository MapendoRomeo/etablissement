
import React, { useRef } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    receiptNumber: string;
    date: string;
    student: string;
    class: string;
    school: string;
    term: string;
    paymentMethod: string;
    amount: number;
    reference: string;
    notes: string;
  };
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receiptData }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Imprimer le reçu
  const handlePrint = () => {
    if (!receiptRef.current) return;
    
    // Clone le reçu pour l'impression
    const printContent = receiptRef.current.cloneNode(true) as HTMLElement;
    
    // Créer une fenêtre d'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Veuillez autoriser les popups pour imprimer');
      return;
    }
    
    // Ajouter du style à la fenêtre d'impression
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu de paiement - ${receiptData.receiptNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .receipt {
              border: 1px solid #e2e8f0;
              padding: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .receipt-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle {
              color: #718096;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
            }
            .info-label {
              width: 150px;
              font-weight: bold;
            }
            .amount {
              font-size: 20px;
              font-weight: bold;
              margin-top: 20px;
              margin-bottom: 20px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #718096;
              font-size: 14px;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              padding-top: 20px;
            }
            .signature-box {
              width: 45%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 50px;
              margin-bottom: 5px;
            }
            .seal-box {
              border: 1px dashed #718096;
              border-radius: 50%;
              width: 120px;
              height: 120px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto;
              color: #718096;
              font-style: italic;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .receipt {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    
    // Imprimer puis fermer la fenêtre
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    
    toast.success('Impression du reçu initiée');
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-2xl font-bold">Reçu de paiement</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-muted transition-colors"
              >
                <svg 
                  className="h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div ref={receiptRef} className="bg-white rounded-lg border border-border p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold">GestionÉcole</div>
                    <div className="text-muted-foreground">Système de gestion scolaire</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">Reçu #{receiptData.receiptNumber}</div>
                    <div className="text-muted-foreground">Date: {receiptData.date}</div>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-b border-border py-6">
                  <h3 className="text-lg font-semibold mb-4">Détails du paiement</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                    <div>
                      <span className="text-muted-foreground">Élève:</span>
                      <span className="font-medium ml-2">{receiptData.student}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Classe:</span>
                      <span className="font-medium ml-2">{receiptData.class}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">École:</span>
                      <span className="font-medium ml-2">{receiptData.school}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Trimestre:</span>
                      <span className="font-medium ml-2">{receiptData.term}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Méthode:</span>
                      <span className="font-medium ml-2">{receiptData.paymentMethod}</span>
                    </div>
                    {receiptData.reference && (
                      <div>
                        <span className="text-muted-foreground">Référence:</span>
                        <span className="font-medium ml-2">{receiptData.reference}</span>
                      </div>
                    )}
                  </div>
                  
                  {receiptData.notes && (
                    <div className="mt-4">
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="mt-1">{receiptData.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-right">
                  <span className="text-muted-foreground">Montant payé:</span>
                  <div className="text-3xl font-bold mt-1">{receiptData.amount.toFixed(2)} $</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    (équivalent à {(receiptData.amount * 1).toFixed(2)} $)
                  </div>
                </div>
                
                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex justify-between">
                    <div className="w-5/12">
                      <div className="mt-12 border-t border-black"></div>
                      <p className="text-center text-sm">Signature du comptable</p>
                    </div>
                    
                    <div className="w-5/12 flex flex-col items-center">
                      <div className="border border-dashed border-gray-400 rounded-full w-24 h-24 flex items-center justify-center">
                        <p className="text-center text-xs text-gray-500 italic">Sceau de l'école</p>
                      </div>
                      <p className="text-center text-sm mt-2">Cachet officiel</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 text-center text-sm text-muted-foreground border-t border-border pt-6">
                  <p>Merci pour votre paiement. Ce reçu a été généré automatiquement.</p>
                  <p>Pour toute question, veuillez contacter le service comptable.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="button-outline"
                >
                  Fermer
                </button>
                <button
                  onClick={handlePrint}
                  className="button-primary"
                >
                  Imprimer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReceiptModal;
