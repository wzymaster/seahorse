/**
 * Copyright 2015 deepsense.ai (CodiLime, Inc)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.deepsense.commons.metrics

import java.io.File
import java.util.concurrent.TimeUnit

import com.codahale.metrics.{MetricRegistry, CsvReporter}
import nl.grons.metrics.scala.InstrumentedBuilder

object MetricsContainer {

  val reportPeriod = 10
  val metricRegistry = new MetricRegistry()

  CsvReporter.forRegistry(metricRegistry)
    .convertRatesTo(TimeUnit.SECONDS)
    .convertDurationsTo(TimeUnit.MILLISECONDS)
    .build(new File("/var/log/deepsense/metrics"))
    .start(reportPeriod, TimeUnit.SECONDS)
}

trait Instrumented extends InstrumentedBuilder {
  val metricRegistry = MetricsContainer.metricRegistry
}
