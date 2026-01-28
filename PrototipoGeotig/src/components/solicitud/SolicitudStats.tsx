/**
 * Dashboard de Estadísticas para Solicitudes
 * Muestra métricas de solicitudes en tiempo real
 */

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, CheckCircle2, XCircle, Users, TrendingUp } from "lucide-react";
import {
  Solicitud,
  calcularEstadisticas,
  EstadisticasSolicitudes,
} from "../../utils/firebaseUtils";

interface SolicitudStatsProps {
  solicitudes: Solicitud[];
  isLoading?: boolean;
}

export function SolicitudStats({
  solicitudes,
  isLoading = false,
}: SolicitudStatsProps) {
  const stats = useMemo<EstadisticasSolicitudes>(() => {
    return calcularEstadisticas(solicitudes);
  }, [solicitudes]);

  const statCards = [
    {
      title: "Total de Solicitudes",
      value: stats.total,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pendientes de Revisión",
      value: stats.pendientes,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Aceptadas",
      value: stats.aceptadas,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rechazadas",
      value: stats.rechazadas,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`${stat.bgColor} border-0 shadow-sm`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Tasa de Aceptación */}
      <Card className="bg-purple-50 border-0 shadow-sm md:col-span-2 lg:col-span-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tasa de Aceptación
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {isLoading ? "..." : `${stats.tasaAceptacion}%`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                De {stats.aceptadas + stats.rechazadas} decisiones finales
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>

            {/* Barra de progreso visual */}
            <div className="flex-1 ml-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, stats.tasaAceptacion))}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
