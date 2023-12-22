import { type ICoreDependencies, DependencyContainer } from "../common/dependencies";
import { LanguagePreferenceViewModel } from "../common/locale";
import { AppThemeViewModel } from "../common/theme";

export class AppDependencyContainer extends DependencyContainer {
  public constructor(coreDependencies: ICoreDependencies) {
    super(coreDependencies);

    this
      .registerSingleton(AppThemeViewModel)
      .registerSingleton(LanguagePreferenceViewModel);
  }
}