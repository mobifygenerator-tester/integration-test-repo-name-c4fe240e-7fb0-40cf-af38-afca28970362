#!/bin/bash -eu
set -o pipefail
set -o nounset

#If the node total is 1, run all the tests sequentially.
if [ $CIRCLE_NODE_TOTAL -eq 1 ]; then
  echo 'Running lint'
  npm run lint
  echo 'Running Unit Tests'
  npm test -- --runInBand
  ./scripts/wait-for-dependencies.sh
  echo 'Verify built files sizes'
  npm run test:max-file-size -- build tests/performance/gzip-size-config.json
  # echo 'Starting Lighthouse Tests.'
  ./tests/performance/lighthouse/run-lighthouse.sh
  # echo 'Running End to End Tests'
  npm run test:e2e

else
  #If the node total is greater than 1
  if [ $CIRCLE_NODE_TOTAL -gt 1 ]; then
    echo $CIRCLE_NODE_TOTAL 'Circle CI nodes. Running tests in parallel.'
    echo 'This is Circle CI node' $CIRCLE_NODE_INDEX'.'

    #Assign the first node to running lighthouse Tests
    if [ $CIRCLE_NODE_INDEX -eq 0 ]; then
      echo 'Running Lint'
      npm run lint
      ./scripts/wait-for-dependencies.sh
      echo 'Running Lighthouse Test'
      ./tests/performance/lighthouse/run-lighthouse.sh
    fi

    # The other cirlce_node_index worker will run the rest of the tests
    if [ $CIRCLE_NODE_INDEX -gt 0 ]; then
      echo 'Running Unit Tests'
      npm test -- --runInBand

      ./scripts/wait-for-dependencies.sh
      echo 'Verify built files sizes'
      npm run test:max-file-size -- build tests/performance/gzip-size-config.json

      echo 'Running End to End Tests'
      # If we have nodes > 2, it will be part of the division to run another test:e2e
      i=0
      for testfile in $(find ./tests/e2e/workflows/ -name '*.js'| sort); do
        if [ $(expr $i % $(expr $CIRCLE_NODE_TOTAL - 1)) -eq $(expr $CIRCLE_NODE_INDEX - 1) ]; then
          echo 'Running test: ' ${testfile}
          npm run test:e2e --test ${testfile}
        fi
        ((i=i+1))
      done
    fi
  fi
fi
