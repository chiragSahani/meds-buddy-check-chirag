import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { useMedications } from '@/hooks/useMedications';
import { toast } from '@/components/ui/sonner';

const medicationSchema = z.object({
  name: z.string()
    .min(1, 'Medication name is required')
    .max(100, 'Medication name must be less than 100 characters')
    .trim(),
  dosage: z.string()
    .min(1, 'Dosage is required')
    .max(50, 'Dosage must be less than 50 characters')
    .trim(),
  frequency: z.enum(['once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'as_needed', 'weekly'], {
    required_error: 'Please select a frequency',
  }),
});

type MedicationFormData = z.infer<typeof medicationSchema>;

const frequencyOptions = [
  { value: 'once_daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily' },
  { value: 'three_times_daily', label: 'Three times daily' },
  { value: 'four_times_daily', label: 'Four times daily' },
  { value: 'as_needed', label: 'As needed' },
  { value: 'weekly', label: 'Weekly' },
] as const;

export const AddMedicationForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { addMedication, isAddingMedication } = useMedications();

  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      frequency: undefined,
    },
  });

  const handleSubmit = async (data: MedicationFormData) => {
    try {
      addMedication(data);
      toast.success('Medication added successfully!');
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Add medication error:', error);
      toast.error('Failed to add medication. Please try again.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Medication</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Add a new medication to your daily routine. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medication Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Aspirin, Metformin"
              {...form.register('name')}
              disabled={isAddingMedication}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage *</Label>
            <Input
              id="dosage"
              placeholder="e.g., 100mg, 1 tablet, 5ml"
              {...form.register('dosage')}
              disabled={isAddingMedication}
            />
            {form.formState.errors.dosage && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dosage.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency *</Label>
            <Select 
              onValueChange={(value) => form.setValue('frequency', value as any)}
              disabled={isAddingMedication}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.frequency && (
              <p className="text-sm text-destructive">
                {form.formState.errors.frequency.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isAddingMedication}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAddingMedication}>
              {isAddingMedication && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Medication
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};