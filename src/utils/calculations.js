export const calculateEqualSplit = (totalAmount, numberOfPeople) => {
    return totalAmount / numberOfPeople;
  };
  
  export const calculateCustomSplit = (totalAmount, shares) => {
    const totalShares = shares.reduce((sum, share) => sum + share, 0);
    return shares.map(share => (share / totalShares) * totalAmount);
  };
  
  export const roundAmount = (amount, method = 'round') => {
    switch (method) {
      case 'ceil':
        return Math.ceil(amount);
      case 'floor':
        return Math.floor(amount);
      case 'round':
      default:
        return Math.round(amount);
    }
  };
  
  export const calculateTax = (amount, taxRate) => {
    return amount * (taxRate / 100);
  };