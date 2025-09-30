
export function formatBrazilianCellphone(value: string): string {
  return value
    .replace(/\D/g, '') // Remove all non-numeric characters
    .replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3') // Format as (XX) XXXXX-XXXX
    .slice(0, 15); // Limit to 15 characters
}

export function formatCpf(value: string): string {
  return value
    .replace(/\D/g, '') // Remove all non-numeric characters
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4') // Format as XXX.XXX.XXX-XX
    .slice(0, 14); // Limit to 14 characters
}

export function formatCnpj(value: string): string {
  return value
    .replace(/\D/g, '') // Remove all non-numeric characters
    .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5') // Format as XX.XXX.XXX/XXXX-XX
    .slice(0, 18); // Limit to 18 characters
}

export function formatRg(value: string): string {
  return value
    .replace(/\D/g, '') // Remove all non-numeric characters
    .replace(/^(\d{2})(\d{3})(\d{3})(\d?).*/, '$1.$2.$3-$4') // Format as XX.XXX.XXX-X
    .slice(0, 12); // Limit to 12 characters
}

export function formatCep(value: string): string {
  return value
    .replace(/\D/g, '') // Remove all non-numeric characters
    .replace(/^(\d{5})(\d{3}).*/, '$1-$2') // Format as XXXXX-XXX
    .slice(0, 9); // Limit to 9 characters
}

export function formatReal(value: string): string {
  const numericValue = parseFloat(value.replace(/[^\d]/g, '')) / 100; // Remove non-numeric characters and divide by 100
  return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Format as Brazilian Real currency
}

export function formatDate(value: string): string {
  return value
    .replace(/\D/g, '') // Remove all non-numeric characters
    .replace(/^(\d{2})(\d{2})(\d{4}).*/, '$1/$2/$3') // Format as DD/MM/YYYY
    .slice(0, 10); // Limit to 10 characters
}