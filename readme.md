# Scrolligy

Scrolligy is a simple to use and feature rich library for displaying dynamic
 scrolling steps or wizards.

## Details and Features

- Dynamic Steps: you can add steps at run-time, at a specific position
- Step validation: each step can define a callback which will disable moving
 to other steps if validation fails
- Step Controller: each step can name it's own controller, either as a
controller object or as a named controller from the current module
- Statefulness: the currently displayed step is reflected in the url
- Multiple scrolligys per page: the directive can be added multiple times per
 page, while providing a unique name to each

## Usage
To use a scrolligy, add a `<scrolligy>` element in the desired place in your
 page. Configuring the scrolligy instance is done as followes:

###Defining scrolligy in your HTML
```html
<scrolligy steps="steps" options="options" id="yo-man"></scrolligy>
```

####Details:
- `steps` - Should reference an array of steps on your scope. The structure
of each step is explained later on.
- `options` - Should reference an object with two fields:
  1. `globalData` - any data that should be available in the scope of all of
  the steps
  2. `stateful` - a boolean value, if `true` current step is reflected in the
  url, otherwise the url is left unchanged (defaults to `true`)

### Defining steps - in your controller
Each step in the `steps` array should be an object with the following structure:
```javascript
var step = {
    templateUrl:
    index:
    isValid: // promise or boolean
    invalid: // true of isValid is false
    controller:
    data:
}
```

####Details:


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