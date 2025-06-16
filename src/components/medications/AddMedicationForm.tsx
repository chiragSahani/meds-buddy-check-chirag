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
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
});

type MedicationFormData = z.infer<typeof medicationSchema>;

const frequencyOptions = [
  { value: 'once_daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily' },
  { value: 'three_times_daily', label: 'Three times daily' },
  { value: 'four_times_daily', label: 'Four times daily' },
  { value: 'as_needed', label: 'As needed' },
  { value: 'weekly', label: 'Weekly' },
];

export const AddMedicationForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { addMedication, isAddingMedication } = useMedications();

  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      frequency: '',
    },
  });

  const handleSubmit = async (data: MedicationFormData) => {
    try {
      addMedication(data);
      toast.success('Medication added successfully!');
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to add medication. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Add a new medication to your daily routine.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              placeholder="e.g., Aspirin, Metformin"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 100mg, 1 tablet"
              {...form.register('dosage')}
            />
            {form.formState.errors.dosage && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dosage.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select onValueChange={(value) => form.setValue('frequency', value)}>
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
              onClick={() => setOpen(false)}
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