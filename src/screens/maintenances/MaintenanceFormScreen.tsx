/**
 * Tela de Cadastro/Edição de Manutenção
 * Formulário completo com React Hook Form + Zod
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaintenancesStackParamList } from '../../navigation/MaintenancesStack';
import { Maintenance, MaintenancePayload, MaintenanceCategory, MaintenanceType } from '../../types/maintenance';
import { Vehicle } from '../../types/vehicle';
import { createMaintenance, updateMaintenance } from '../../services/maintenanceService';
import { getVehicles } from '../../services/vehicleService';
import { getMaintenanceCategories, getMaintenanceTypesByCategory } from '../../services/maintenanceTypeService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import SelectInput from '../../components/SelectInput/SelectInput';
import DatePickerInput from '../../components/DatePickerInput';
import CurrencyInput from '../../components/CurrencyInput';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const maintenanceSchema = z.object({
  vehicle_id: z.string().min(1, 'Veículo é obrigatório'),
  maintenance_category_id: z.string().min(1, 'Categoria é obrigatória'),
  maintenance_type_id: z.string().min(1, 'Tipo de manutenção é obrigatório'),
  description: z.string().optional(),
  performed_at: z.string().min(1, 'Data é obrigatória').regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido. Use AAAA-MM-DD'),
  current_mileage: z.string().min(1, 'Quilometragem é obrigatória'),
  cost: z.string().min(1, 'Valor é obrigatório'),
  workshop_name: z.string().optional(),
  invoice_number: z.string().optional(),
  notes: z.string().optional(),
  next_maintenance_mileage: z.string().optional(),
  next_maintenance_date: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'Formato inválido. Use AAAA-MM-DD',
  }),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
type NavigationProp = NativeStackNavigationProp<MaintenancesStackParamList>;
type RouteProps = RouteProp<MaintenancesStackParamList, 'MaintenanceForm'>;

export default function MaintenanceFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const maintenance = route.params?.maintenance;
  const isEdit = !!maintenance;
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [categories, setCategories] = useState<MaintenanceCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [types, setTypes] = useState<MaintenanceType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicle_id: maintenance?.vehicle?.id ? maintenance.vehicle.id.toString() : '',
      maintenance_category_id: maintenance?.maintenance_type?.category?.id ? maintenance.maintenance_type.category.id.toString() : '',
      maintenance_type_id: maintenance?.maintenance_type_id ? maintenance.maintenance_type_id.toString() : '',
      description: maintenance?.description || '',
      performed_at: maintenance?.performed_at || '',
      current_mileage: maintenance?.current_mileage !== undefined ? maintenance.current_mileage.toString() : '',
      cost: maintenance?.cost !== undefined ? Math.round(maintenance.cost * 100).toString() : '',
      workshop_name: maintenance?.workshop_name || '',
      invoice_number: maintenance?.invoice_number || '',
      notes: maintenance?.notes || '',
      next_maintenance_mileage: maintenance?.next_maintenance_mileage !== undefined ? maintenance.next_maintenance_mileage.toString() : '',
      next_maintenance_date: maintenance?.next_maintenance_date || '',
    },
  });

  const watchedCategoryId = watch('maintenance_category_id');

  const loadVehicles = useCallback(async () => {
    setLoadingVehicles(true);
    try {
      const response = await getVehicles(1);
      setVehicles(response.data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar veículos.');
    } finally {
      setLoadingVehicles(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const data = await getMaintenanceCategories();
      setCategories(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar categorias.');
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const loadTypesByCategory = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setTypes([]);
      return;
    }
    setLoadingTypes(true);
    try {
      const data = await getMaintenanceTypesByCategory(parseInt(categoryId, 10));
      setTypes(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar tipos.');
    } finally {
      setLoadingTypes(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
      loadCategories();
      if (!isEdit) {
        reset({
          vehicle_id: '',
          maintenance_category_id: '',
          maintenance_type_id: '',
          description: '',
          performed_at: '',
          current_mileage: '',
          cost: '',
          workshop_name: '',
          invoice_number: '',
          notes: '',
          next_maintenance_mileage: '',
          next_maintenance_date: '',
        });
        setTypes([]);
      } else if (maintenance?.maintenance_type?.category?.id) {
        loadTypesByCategory(maintenance.maintenance_type.category.id.toString());
      }
    }, [isEdit, reset, loadVehicles, loadCategories, loadTypesByCategory])
  );

  // Carrega tipos quando a categoria mudar
  React.useEffect(() => {
    if (watchedCategoryId) {
      loadTypesByCategory(watchedCategoryId);
      // Limpa o tipo se a categoria mudar e o tipo atual não pertence mais
      const currentTypeId = watch('maintenance_type_id');
      if (currentTypeId) {
        const exists = types.find((t) => t.id.toString() === currentTypeId);
        if (!exists) {
          setValue('maintenance_type_id', '');
        }
      }
    } else {
      setTypes([]);
    }
  }, [watchedCategoryId]);

  async function onSubmit(data: MaintenanceFormData) {
    setLoading(true);

    try {
      const payload: MaintenancePayload = {
        vehicle_id: parseInt(data.vehicle_id, 10),
        maintenance_type_id: parseInt(data.maintenance_type_id, 10),
        description: data.description || undefined,
        performed_at: data.performed_at,
        current_mileage: parseInt(data.current_mileage.replace(/\D/g, ''), 10),
        cost: parseInt(data.cost, 10) / 100,
        workshop_name: data.workshop_name || undefined,
        invoice_number: data.invoice_number || undefined,
        notes: data.notes || undefined,
        next_maintenance_mileage: data.next_maintenance_mileage ? parseInt(data.next_maintenance_mileage.replace(/\D/g, ''), 10) : undefined,
        next_maintenance_date: data.next_maintenance_date || undefined,
      };

      if (isEdit && maintenance) {
        await updateMaintenance(maintenance.id, payload);
        Alert.alert('Sucesso', 'Manutenção atualizada com sucesso.');
      } else {
        await createMaintenance(payload);
        Alert.alert('Sucesso', 'Manutenção cadastrada com sucesso.');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Ocorreu um erro ao salvar a manutenção. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            {isEdit ? 'Editar Manutenção' : 'Nova Manutenção'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="vehicle_id"
            render={({ field: { onChange, value } }) => {
              const selected = vehicles.find((v) => v.id.toString() === (value || '')) || null;
              return (
                <SelectInput<Vehicle>
                  label="Veículo *"
                  placeholder={loadingVehicles ? 'Carregando veículos...' : 'Selecionar veículo'}
                  value={selected}
                  options={vehicles}
                  getOptionLabel={(item) => item.nickname || `${item.brand?.name || ''} ${item.model?.name || ''}`.trim() || `Veículo #${item.id}`}
                  onSelect={(item) => onChange(item ? item.id.toString() : '')}
                  disabled={loadingVehicles || vehicles.length === 0}
                  error={errors.vehicle_id?.message}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="maintenance_category_id"
            render={({ field: { onChange, value } }) => {
              const selected = categories.find((c) => c.id.toString() === (value || '')) || null;
              return (
                <SelectInput<MaintenanceCategory>
                  label="Categoria *"
                  placeholder={loadingCategories ? 'Carregando categorias...' : 'Selecionar categoria'}
                  value={selected}
                  options={categories}
                  getOptionLabel={(item) => item.name}
                  onSelect={(item) => {
                    onChange(item ? item.id.toString() : '');
                    setValue('maintenance_type_id', '');
                  }}
                  disabled={loadingCategories || categories.length === 0}
                  error={errors.maintenance_category_id?.message}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="maintenance_type_id"
            render={({ field: { onChange, value } }) => {
              const selected = types.find((t) => t.id.toString() === (value || '')) || null;
              return (
                <SelectInput<MaintenanceType>
                  label="Tipo de Manutenção *"
                  placeholder={loadingTypes ? 'Carregando tipos...' : 'Selecionar tipo'}
                  value={selected}
                  options={types}
                  getOptionLabel={(item) => item.name}
                  onSelect={(item) => onChange(item ? item.id.toString() : '')}
                  disabled={loadingTypes || types.length === 0 || !watchedCategoryId}
                  error={errors.maintenance_type_id?.message}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="performed_at"
            render={({ field: { onChange, value } }) => (
              <DatePickerInput
                label="Data da Manutenção *"
                value={value}
                onChange={onChange}
                error={errors.performed_at?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            control={control}
            name="current_mileage"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Quilometragem Atual *"
                placeholder="Ex: 120000"
                keyboardType="number-pad"
                value={value || ''}
                onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
                onBlur={onBlur}
                error={errors.current_mileage?.message}
                editable={!loading}
              />
            )}
          />

          <Controller
            control={control}
            name="cost"
            render={({ field: { onChange, value } }) => (
              <CurrencyInput
                label="Valor *"
                value={value || ''}
                onChangeText={onChange}
                error={errors.cost?.message}
                editable={!loading}
              />
            )}
          />

          <Controller
            control={control}
            name="workshop_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Oficina"
                placeholder="Nome da oficina"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.workshop_name?.message}
                editable={!loading}
              />
            )}
          />

          <Controller
            control={control}
            name="invoice_number"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Número da Nota Fiscal"
                placeholder="Ex: NF-123456"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.invoice_number?.message}
                editable={!loading}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Descrição"
                placeholder="Descreva o serviço realizado"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                editable={!loading}
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />
            )}
          />

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Observações"
                placeholder="Observações adicionais"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.notes?.message}
                editable={!loading}
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />
            )}
          />

          {/* Next maintenance preview fields */}
          <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Próxima Manutenção (opcional)</Text>
          </View>

          <Controller
            control={control}
            name="next_maintenance_mileage"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Próxima Quilometragem"
                placeholder="Ex: 130000"
                keyboardType="number-pad"
                value={value || ''}
                onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
                onBlur={onBlur}
                error={errors.next_maintenance_mileage?.message}
                editable={!loading}
              />
            )}
          />

          <Controller
            control={control}
            name="next_maintenance_date"
            render={({ field: { onChange, value } }) => (
              <DatePickerInput
                label="Próxima Data"
                value={value}
                onChange={onChange}
                error={errors.next_maintenance_date?.message}
                disabled={loading}
              />
            )}
          />

          <Button
            title={isEdit ? 'Atualizar Manutenção' : 'Cadastrar Manutenção'}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 24,
  },
  form: {
    padding: 24,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
  },
});
