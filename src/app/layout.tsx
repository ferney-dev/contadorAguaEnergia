import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Consumo de Agua y Energía',
  description: 'Una aplicación para monitorear y comparar el consumo de agua y energía en diferentes sistemas de gestión integrada (SGI).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      
      {/* 🔥 ESTE ES EL CAMBIO IMPORTANTE */}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}