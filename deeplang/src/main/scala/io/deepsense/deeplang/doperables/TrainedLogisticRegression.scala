/**
 * Copyright (c) 2015, CodiLime Inc.
 */

package io.deepsense.deeplang.doperables

import scala.concurrent.Future

import org.apache.spark.mllib.classification.LogisticRegressionModel
import org.apache.spark.mllib.linalg.Vector

import io.deepsense.deeplang.doperables.dataframe.DataFrame
import io.deepsense.deeplang.{DOperable, DMethod1To1, ExecutionContext, Model}
import io.deepsense.reportlib.model.ReportContent

case class TrainedLogisticRegression(
    model: Option[LogisticRegressionModel],
    featureColumns: Option[Seq[String]],
    targetColumn: Option[String])
  extends LogisticRegression
  with Scorable
  with RegressionScoring {

  def this() = this(None, None, None)

  override def toInferrable: DOperable = new TrainedLogisticRegression()

  private var physicalPath: Option[String] = None

  override def url: Option[String] = physicalPath

  override val score = new DMethod1To1[String, DataFrame, DataFrame] {

    override def apply(context: ExecutionContext)
        (predictionColumnName: String)
        (dataFrame: DataFrame): DataFrame = {
      model.get.clearThreshold()
      scoreRegression(context)(
        dataFrame,
        featureColumns.get,
        targetColumn.get,
        predictionColumnName,
        identity,
        model.get)
    }
  }

  override def report: Report = Report(ReportContent("Report for TrainedLogisticRegression.\n" +
    s"Feature columns: ${featureColumns.get.mkString(", ")}\n" +
    s"Target column: ${targetColumn.get}\n" +
    s"Model: $model"))

  override def save(context: ExecutionContext)(path: String): Unit = {
    val params = TrainedLogisticRegressionDescriptor(
      model.get.weights,
      model.get.intercept,
      featureColumns.get,
      targetColumn.get)
    context.hdfsClient.saveObjectToFile(path, params)
    this.physicalPath = Some(path)
  }
}

object TrainedLogisticRegression {
  def loadFromHdfs(context: ExecutionContext)(path: String): TrainedLogisticRegression = {
    val params: TrainedLogisticRegressionDescriptor =
      context.hdfsClient.readFileAsObject[TrainedLogisticRegressionDescriptor](path)
    TrainedLogisticRegression(
      Some(new LogisticRegressionModel(params.modelWeights, params.modelIntercept)),
      Some(params.featureColumns),
      Some(params.targetColumn))
  }
}

case class TrainedLogisticRegressionDescriptor(
  modelWeights: Vector,
  modelIntercept: Double,
  featureColumns: Seq[String],
  targetColumn: String) extends Deployable {

  override def deploy(f: Model => Future[String]): Future[String] =
    throw new UnsupportedOperationException()
}
