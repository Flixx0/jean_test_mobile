import { render, screen } from '@testing-library/react-native';
import { EditorDateFields } from '@components/EditorDateFields';
import { withSpecWrapper } from '../specs/wrapper';
import { useForm } from 'react-hook-form';
import type { InvoiceFormData } from '@components/EditorInvoiceLines';

const TestComponent = ({ errors }: { errors?: any }) => {
  const { control } = useForm<InvoiceFormData>({
    defaultValues: {
      date: '',
      deadline: '',
    },
  });

  return <EditorDateFields control={control} errors={errors || {}} />;
};

describe('EditorDateFields', () => {
  it('renders editor date fields with all required fields', () => {
    render(withSpecWrapper(<TestComponent />));

    expect(screen.getByTestId('editor-date-fields')).toBeTruthy();
    expect(screen.getByTestId('editor-date-fields-date-label')).toBeTruthy();
    expect(screen.getByTestId('editor-date-fields-deadline-label')).toBeTruthy();
  });

  it('displays the correct date label', () => {
    render(withSpecWrapper(<TestComponent />));

    const label = screen.getByTestId('editor-date-fields-date-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Date');
  });

  it('displays the correct deadline label', () => {
    render(withSpecWrapper(<TestComponent />));

    const label = screen.getByTestId('editor-date-fields-deadline-label');
    expect(label).toBeTruthy();
    expect(label).toHaveTextContent('Deadline');
  });

  it('displays error message when date error is present', () => {
    render(
      withSpecWrapper(
        <TestComponent errors={{ date: { type: 'required', message: 'Date is required' } }} />,
      ),
    );

    const error = screen.getByTestId('editor-date-fields-date-error');
    expect(error).toBeTruthy();
    expect(error).toHaveTextContent('Date is required');
  });

  it('displays error message when deadline error is present', () => {
    render(
      withSpecWrapper(
        <TestComponent
          errors={{ deadline: { type: 'required', message: 'Deadline is required' } }}
        />,
      ),
    );

    const error = screen.getByTestId('editor-date-fields-deadline-error');
    expect(error).toBeTruthy();
    expect(error).toHaveTextContent('Deadline is required');
  });

  it('does not display errors when no errors are present', () => {
    render(withSpecWrapper(<TestComponent />));

    expect(screen.queryByTestId('editor-date-fields-date-error')).toBeNull();
    expect(screen.queryByTestId('editor-date-fields-deadline-error')).toBeNull();
  });
});
