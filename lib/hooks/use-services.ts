"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceService } from "@/lib/services/service-service";
import { Database } from "@/lib/supabase/database.types";

type Service = Database["public"]["Tables"]["services"]["Row"];
const serviceService = new ServiceService();

export function useServices(barbershopId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["services", barbershopId];

  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery<Service[]>({
    queryKey,
    queryFn: () => serviceService.getServices(barbershopId),
  });

  const createMutation = useMutation<Service, Error, Partial<Service>>({
    mutationFn: (service) => serviceService.createService(service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation<Service, Error, { id: string; updates: Partial<Service> }>({
    mutationFn: ({ id, updates }) => serviceService.updateService(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const assignEmployeeMutation = useMutation<void, Error, { serviceId: string; employeeId: string }>({
    mutationFn: ({ serviceId, employeeId }) => serviceService.assignEmployeeToService(serviceId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeEmployeeMutation = useMutation<void, Error, { serviceId: string; employeeId: string }>({
    mutationFn: ({ serviceId, employeeId }) => serviceService.removeEmployeeFromService(serviceId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    services,
    isLoading,
    error,
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    assignEmployee: assignEmployeeMutation.mutateAsync,
    removeEmployee: removeEmployeeMutation.mutateAsync,
  };
}