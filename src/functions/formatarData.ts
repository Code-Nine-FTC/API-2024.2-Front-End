const formatarData = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Months are 0-based
  };

export default formatarData;