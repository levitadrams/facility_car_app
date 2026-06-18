/**
 * Tela de Cadastro/Edição de Veículo
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
import { VehiclesStackParamList } from '../../navigation/VehiclesStack';
import { VehiclePayload } from '../../types/vehicle';
import { Brand } from '../../types/brand';
import { VehicleModel } from '../../types/vehicleModel';
import { FipeYear } from '../../types/fipeYear';
import { createVehicle, updateVehicle } from '../../services/vehicleService';
import { searchBrands } from '../../services/brandService';
import { searchModels } from '../../services/modelService';
import { getYearsByModel } from '../../services/yearService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AutocompleteInput from '../../components/Autocomplete/AutocompleteInput';
import SelectInput from '../../components/SelectInput/SelectInput';
import theme from '../../theme';

const currentYear = new Date().getFullYear();

const vehicleSchema = z.object({
  nickname: z.string().optional(),
  brand_id: z.string().min(1, 'Marca é obrigatória'),
  vehicle_model_id: z.string().min(1, 'Modelo é obrigatório'),
  year: z.string().min(1, 'Ano é obrigatório'),
  plate: z
    .string()
    .min(1, 'Placa é obrigatória')
    .regex(
      /^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/,
      'Formato inválido. Use ABC1D23 ou ABC1234'
    ),
  color: z.string().optional(),
  fuel_type: z.string().optional(),
  current_mileage: z.string().min(1, 'Quilometragem é obrigatória'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;
type NavigationProp = NativeStackNavigationProp<VehiclesStackParamList>;
type RouteProps = RouteProp<VehiclesStackParamList, 'VehicleForm'>;

export default function VehicleFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const vehicle = route.params?.vehicle;
  const isEdit = !!vehicle;

  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(
    vehicle?.brand ? { id: vehicle.brand_id, name: vehicle.brand.name } : null
  );
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(
    vehicle?.model ? { id: vehicle.vehicle_model_id, brand_id: vehicle.brand_id, name: vehicle.model.name } : null
  );
  const [years, setYears] = useState<FipeYear[]>([]);
  const [loadingYears, setLoadingYears] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      nickname: vehicle?.nickname || '',
      brand_id: vehicle?.brand_id ? vehicle.brand_id.toString() : '',
      vehicle_model_id: vehicle?.vehicle_model_id ? vehicle.vehicle_model_id.toString() : '',
      year: vehicle?.year ? vehicle.year.toString() : '',
      plate: vehicle?.plate || '',
      color: vehicle?.color || '',
      fuel_type: vehicle?.fuel_type || '',
      current_mileage: vehicle?.current_mileage !== undefined ? vehicle.current_mileage.toString() : '',
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (!isEdit) {
        reset({
          nickname: '',
          brand_id: '',
          vehicle_model_id: '',
          year: '',
          plate: '',
          color: '',
          fuel_type: '',
          current_mileage: '',
        });
        setSelectedBrand(null);
        setSelectedModel(null);
        setYears([]);
        setLoadingYears(false);
      }
    }, [isEdit, reset])
  );

  const handleBrandSearch = useCallback(async (query: string): Promise<Brand[]> => {
    const response = await searchBrands(query);
    return response.data;
  }, []);

  const handleModelSearch = useCallback(async (query: string): Promise<VehicleModel[]> => {
    if (!selectedBrand) return [];
    const response = await searchModels(selectedBrand.id, query);
    return response.data;
  }, [selectedBrand]);

  const handleBrandSelect = (brand: Brand | null) => {
    setSelectedBrand(brand);
    setValue('brand_id', brand ? brand.id.toString() : '');
    // Reset model when brand changes
    setSelectedModel(null);
    setValue('vehicle_model_id', '');
  };

  const handleModelSelect = async (model: VehicleModel | null) => {
    setSelectedModel(model);
    setValue('vehicle_model_id', model ? model.id.toString() : '');
    // Reset year/fuel when model changes
    setValue('year', '');
    setValue('fuel_type', '');
    setYears([]);

    if (model && selectedBrand) {
      setLoadingYears(true);
      try {
        const data = await getYearsByModel(selectedBrand.id, model.id);
        setYears(data);
      } catch {
        setYears([]);
      } finally {
        setLoadingYears(false);
      }
    }
  };

  const handleYearSelect = (yearItem: FipeYear | null) => {
    if (yearItem?.year) {
      setValue('year', yearItem.year.toString());
    }
    if (yearItem?.fuel_type) {
      setValue('fuel_type', yearItem.fuel_type);
    }
    if (!yearItem) {
      setValue('year', '');
      setValue('fuel_type', '');
    }
  };

  async function onSubmit(data: VehicleFormData) {
    setLoading(true);

    try {
      const payload: VehiclePayload = {
        nickname: data.nickname || undefined,
        brand_id: parseInt(data.brand_id, 10),
        vehicle_model_id: parseInt(data.vehicle_model_id, 10),
        year: parseInt(data.year, 10),
        plate: data.plate.toUpperCase(),
        color: data.color || undefined,
        fuel_type: data.fuel_type || undefined,
        current_mileage: parseInt(data.current_mileage.replace(/\D/g, ''), 10),
      };

      if (isEdit && vehicle) {
        await updateVehicle(vehicle.id, payload);
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso.');
      } else {
        await createVehicle(payload);
        Alert.alert('Sucesso', 'Veículo cadastrado com sucesso.');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Ocorreu um erro ao salvar o veículo. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEdit ? 'Editar Veículo' : 'Novo Veículo'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="nickname"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Apelido"
                placeholder="Ex: Meu Carro"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nickname?.message}
                editable={!loading}
              />
            )}
          />

          <Controller
            control={control}
            name="brand_id"
            render={() => (
              <AutocompleteInput<Brand>
                label="Marca *"
                placeholder="Pesquisar marca..."
                value={selectedBrand}
                displayValue={selectedBrand?.name || ''}
                onSelect={handleBrandSelect}
                onSearch={handleBrandSearch}
                getItemLabel={(item) => item.name}
                error={errors.brand_id?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="vehicle_model_id"
            render={() => (
              <AutocompleteInput<VehicleModel>
                label="Modelo *"
                placeholder={selectedBrand ? 'Pesquisar modelo...' : 'Selecione uma marca primeiro'}
                value={selectedModel}
                displayValue={selectedModel?.name || ''}
                onSelect={handleModelSelect}
                onSearch={handleModelSearch}
                getItemLabel={(item) => item.name}
                disabled={!selectedBrand}
                error={errors.vehicle_model_id?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="year"
            render={() => (
              <SelectInput<FipeYear>
                label="Ano / Combustível"
                placeholder={
                  loadingYears
                    ? 'Carregando anos...'
                    : selectedModel
                    ? 'Selecionar ano e combustível'
                    : 'Selecione um modelo primeiro'
                }
                value={
                  years.find(
                    (y) =>
                      y.year?.toString() === (control._formValues.year || '') &&
                      y.fuel_type === (control._formValues.fuel_type || '')
                  ) || null
                }
                options={years}
                getOptionLabel={(item) => item.name}
                onSelect={handleYearSelect}
                disabled={!selectedModel || loadingYears || years.length === 0}
                error={errors.year?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="plate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Placa *"
                placeholder="Ex: ABC1D23"
                value={value}
                onChangeText={(text) => onChange(text.toUpperCase())}
                onBlur={onBlur}
                error={errors.plate?.message}
                editable={!loading}
                autoCapitalize="characters"
                maxLength={7}
              />
            )}
          />

          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Cor"
                placeholder="Ex: Prata"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.color?.message}
                editable={!loading}
                autoCapitalize="words"
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

          <Button
            title={isEdit ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
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
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  form: {
    padding: theme.layout.containerPadding,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
});
