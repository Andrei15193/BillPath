import type { BasicDependency, ComplexDependency, SimpleDependency } from "./IDependencyResolver";
import { useViewModel, type INotifyPropertiesChanged } from "react-model-view-viewmodel";
import { useDependency } from "./useDependency";

export function useViewModelDependency<TViewModel extends INotifyPropertiesChanged>(viewModelType: BasicDependency<TViewModel>): TViewModel;
export function useViewModelDependency<TViewModel extends INotifyPropertiesChanged>(viewModelType: SimpleDependency<TViewModel>): TViewModel;
export function useViewModelDependency<TViewModel extends INotifyPropertiesChanged, TAdditional extends readonly any[]>(viewModelType: ComplexDependency<TViewModel, TAdditional>, additionalDependencies: TAdditional): TViewModel;

export function useViewModelDependency<TViewModel extends INotifyPropertiesChanged, TAdditional extends readonly any[]>(viewModelType: BasicDependency<TViewModel> | SimpleDependency<TViewModel> | ComplexDependency<TViewModel, TAdditional>, additionalDependencies: TAdditional = [] as any as TAdditional): TViewModel {
  const viewModel = useDependency<TViewModel, TAdditional>(viewModelType as any, additionalDependencies);
  useViewModel(viewModel);

  return viewModel;
}