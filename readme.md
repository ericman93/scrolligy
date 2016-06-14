# Scrolligy

Scrolligy is a simple angular library for dynamic step scrolls

## Usage
Controller
```
$scope.steps = [{
    templateUrl: 
    index:
    isValid: // promise or boolean
    invalid: // true of isValid is false
    controller:
    data: 
}]
```

Html
```
<scrolligy current-step="step" steps="steps" global-data="gloablData" id="yo-man"></scrolligy>
```

### Service
for you to contro the steps you muse use the Scrolligy serice.

Using get function will return your scrolligy by his id, if no id required the default scrolligy will return.

##### Avalible function for scrolligy
```
next()                      # next step 
previous()                  # previous step
addStep(stepObject, index)  # add new step. if no index, will add after current step
removeStep(index)           # remove the step in the index
globalData                  # the global data the was given to the scorlligy
getCurrentStep()            # returns the current step
goToStep(index)             # go to index
```

### Controller
When applying controller for step, <i>setScrolligy</i> function will be called.
```
setScrolligy(scrolligyName, stepData)
```