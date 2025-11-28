/**
 * Converte o tipo de veículo do valor de banco (CAR, MOTO)
 * para o rótulo exibido na UI (CARRO, MOTO).
 */
export function formatVehicleType(type) {
  if (!type) return "";
  const typeMap = {
    CAR: "CARRO",
    MOTO: "MOTO",
  };
  return typeMap[type] || type;
}
