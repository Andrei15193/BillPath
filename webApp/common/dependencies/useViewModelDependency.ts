import type { Type } from "./IDependencyResolver";
import { useViewModel, type INotifyPropertiesChanged } from "react-model-view-viewmodel";
import { useDependency } from "./useDependency";

export function useViewModelDependency<TViewModel extends INotifyPropertiesChanged>(viewModelType: Type<TViewModel>, watchedProperties?: readonly (keyof TViewModel)[]): TViewModel {
  const viewModel = useDependency(viewModelType);
  useViewModel(viewModel, watchedProperties);

  return viewModel;
}