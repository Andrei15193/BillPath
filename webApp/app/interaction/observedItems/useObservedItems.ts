import { type IReadOnlyObservableCollection, ObservableCollection, useEvent, useObservableCollection } from "react-model-view-viewmodel";
import { useMemo } from "react";
import { type EqualityComparerCallback, areSame } from "../../../common/equalityComparer";
import { ObservedItem } from "./ObservedItem";

export interface IUseObservedItemsOptions<T> {
  readonly areSameItems?: EqualityComparerCallback<T>;

  readonly addedItemAnimationDurationInMilliseconds?: number;
  readonly updatedItemAnimationDurationInMilliseconds?: number;
  readonly removedItemAnimationDurationInMilliseconds?: number;
}

export function useObservedItems<T>(sourceCollection: IReadOnlyObservableCollection<T>, options: IUseObservedItemsOptions<T> = {}): IReadOnlyObservableCollection<ObservedItem<T>> {
  const {
    areSameItems = areSame,
    addedItemAnimationDurationInMilliseconds,
    updatedItemAnimationDurationInMilliseconds,
    removedItemAnimationDurationInMilliseconds
  } = options;

  const observedItems = useMemo(
    () => new ObservableCollection<ObservedItem<T>>(...sourceCollection.map(item => new ObservedItem<T>(item))),
    [sourceCollection]
  );
  useObservableCollection(observedItems);

  useEvent(
    sourceCollection.collectionChanged,
    (_, { addedItems, removedItems }) => {
      const sourceCollectionChangesStartIndex = Math.min(...addedItems.map((_, index) => index), ...removedItems.map((_, index) => index));

      let observedItemIndex = 0;
      let visibleItemsCount = 0;
      let startIndexOffset = 0;
      while (observedItemIndex < observedItems.length && visibleItemsCount < sourceCollectionChangesStartIndex) {
        if (!observedItems[observedItemIndex].removed)
          visibleItemsCount++;
        else
          startIndexOffset++;

        observedItemIndex++;
      }

      const removedVisibleObservedItems = observedItems
        .filter(observedItem => !observedItem.removed)
        .slice(sourceCollectionChangesStartIndex, sourceCollectionChangesStartIndex + removedItems.length);

      const changeToken = {};
      const addedObservedItems: ObservedItem<T>[] = [];
      const updatedObservedItems: ObservedItem<T>[] = [];
      const removedObservedItems: ObservedItem<T>[] = [];

      addedItems.forEach(addedItem => {
        const indexOfRemovedObservedItem = removedVisibleObservedItems.findIndex(({ item: removedItem }) => areSameItems(addedItem, removedItem));
        if (indexOfRemovedObservedItem < 0) {
          const addedObservedItem = new ObservedItem<T>(addedItem);

          if (addedItemAnimationDurationInMilliseconds !== 0) {
            addedObservedItem.state = "added";

            if (addedItemAnimationDurationInMilliseconds !== null && addedItemAnimationDurationInMilliseconds !== undefined) {
              addedObservedItem.changeToken = changeToken;
              addedObservedItems.push(addedObservedItem);
            }
          }

          observedItems.splice(startIndexOffset + sourceCollectionChangesStartIndex, 0, addedObservedItem);
        }
        else {
          const updatedObservedItem = removedVisibleObservedItems[indexOfRemovedObservedItem];

          if (updatedItemAnimationDurationInMilliseconds !== 0) {
            updatedObservedItem.state = "updated";

            if (updatedItemAnimationDurationInMilliseconds !== null && updatedItemAnimationDurationInMilliseconds !== undefined) {
              updatedObservedItem.changeToken = changeToken;
              updatedObservedItems.push(updatedObservedItem);
            }
          }

          removedVisibleObservedItems.splice(indexOfRemovedObservedItem, 1);
        }
        startIndexOffset++;
      });

      if (removedItemAnimationDurationInMilliseconds === 0)
        removedVisibleObservedItems.forEach(removedVisibleObservedItem => {
          const removedObservedItemIndex = observedItems.findIndex(observedItem => observedItem === removedVisibleObservedItem);
          if (removedObservedItemIndex >= 0)
            observedItems.splice(removedObservedItemIndex, 1);
        });
      else
        removedVisibleObservedItems.forEach(removedVisibleObservedItem => {
          removedVisibleObservedItem.state = "removed";

          if (removedItemAnimationDurationInMilliseconds !== null && removedItemAnimationDurationInMilliseconds !== undefined) {
            removedVisibleObservedItem.changeToken = changeToken;
            removedObservedItems.push(removedVisibleObservedItem);
          }
        });

      if (addedObservedItems.length > 0)
        setTimeout(
          () => {
            addedObservedItems.forEach(addedObservedItem => {
              if (addedObservedItem.changeToken === changeToken)
                addedObservedItem.state = "unchanged";
            });
          },
          addedItemAnimationDurationInMilliseconds
        );

      if (updatedObservedItems.length > 0)
        setTimeout(
          () => {
            updatedObservedItems.forEach(updatedObservedItem => {
              if (updatedObservedItem.changeToken === changeToken)
                updatedObservedItem.state = "unchanged";
            });
          },
          updatedItemAnimationDurationInMilliseconds
        );

      if (removedObservedItems.length > 0)
        setTimeout(
          () => {
            removedObservedItems.forEach(removedObservedItem => {
              const removedObservedItemIndex = observedItems.findIndex(observedItem => observedItem === removedObservedItem);
              if (removedObservedItemIndex >= 0)
                observedItems.splice(removedObservedItemIndex, 1);
            });
          },
          removedItemAnimationDurationInMilliseconds
        );
    },
    [observedItems, areSameItems]
  );

  return observedItems;
}